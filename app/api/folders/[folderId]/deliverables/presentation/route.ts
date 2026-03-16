import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ragSearch } from "@/lib/rag";
import { classifyClient } from "@/lib/classifier";
import { TEMPLATES } from "@/lib/templates";
import { Anthropic } from "@anthropic-ai/sdk";

interface PresentationRouteContext {
  params: Promise<{
    folderId: string;
  }>;
}

interface SlideContent {
  position: number;
  title: string;
  content: string;
}

interface PresentationResult {
  templateId: number;
  templateName: string;
  slides: SlideContent[];
  markdown: string;
}

/**
 * POST /api/folders/[folderId]/deliverables/presentation
 * Gera apresentação comercial completa baseada em classificação automática
 *
 * Pipeline crítico:
 * 1. Validar folder
 * 2. ragSearch com minScore: 0, topK: 20 (máximo contexto)
 * 3. Se sem contexto → erro 400
 * 4. classifyClient → obtém template automático
 * 5. Carregar estrutura do template
 * 6. Gerar 10 slides via Claude
 * 7. Retornar presentation + classification + template
 * 8. Salvar no histórico
 */
export async function POST(
  request: NextRequest,
  { params }: PresentationRouteContext
) {
  const { folderId } = await params;

  try {
    const body = await request.json();
    const { documentIds } = body || {};

    // Step 1: Validar que a pasta existe
    console.log(
      `[Presentation] Starting generation for folder ${folderId}${
        documentIds && documentIds.length > 0
          ? ` with ${documentIds.length} document(s) filtered`
          : ""
      }`
    );

    const folder = await db.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    // Step 2: Buscar contexto completo (minScore: 0, topK: 20, com filtro opcional)
    console.log(`[Presentation] Fetching full context for folder...`);

    let ragResult;
    try {
      ragResult = await ragSearch("", folderId, {
        topK: 20,
        minScore: 0,
        documentIds,
      });
    } catch (ragError) {
      console.error("RAG search failed:", ragError);
      return NextResponse.json(
        { error: "Failed to fetch documents" },
        { status: 500 }
      );
    }

    // Step 3: Validar que há contexto
    if (!ragResult.hasContext) {
      return NextResponse.json(
        { error: "Adicione documentos à pasta antes de gerar a apresentação" },
        { status: 400 }
      );
    }

    console.log(
      `[Presentation] Context retrieved: ${ragResult.chunks.length} chunks`
    );

    // Step 4: Classificar cliente
    console.log(`[Presentation] Classifying client...`);

    let classification;
    try {
      classification = await classifyClient(ragResult.contextText);
    } catch (classifyError) {
      console.error("Classification failed:", classifyError);
      return NextResponse.json(
        { error: "Failed to classify client" },
        { status: 500 }
      );
    }

    console.log(
      `[Presentation] Client classified as: ${classification.template_id} - ${classification.template_name}`
    );

    // Step 5: Carregar estrutura do template
    const template = TEMPLATES[classification.template_id];

    if (!template) {
      return NextResponse.json(
        { error: `Template ${classification.template_id} not found` },
        { status: 500 }
      );
    }

    // Step 6: Gerar slides via Claude
    console.log(`[Presentation] Generating ${template.slide_structure.length} slides...`);

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const slidesJSON = JSON.stringify(template.slide_structure, null, 2);
    const systemPrompt = `Você é um copywriter estratégico da Gabi Produções.
Você vai gerar uma apresentação comercial completa baseada nos dados do cliente e no template selecionado.

TEMPLATE SELECIONADO: ${template.name}
TOM DE VOZ: ${template.tone_of_voice.join(", ")}
CLIENTE: ${folder.clientName}${folder.sector ? ` | SETOR: ${folder.sector}` : ""}

ESTRUTURA ESPERADA (${template.slide_structure.length} slides):
${slidesJSON}

INSTRUÇÕES CRÍTICAS:
1. Gere EXATAMENTE ${template.slide_structure.length} slides, um para cada posição
2. Use dados REAIS do cliente encontrados no contexto
3. Se não encontrar dado específico, use [PREENCHER] como marcador
4. NUNCA invente informações do cliente
5. Mantenha o tom de voz do template rigorosamente
6. O slide 1 deve ter o nome do cliente em destaque
7. Responda APENAS em JSON válido, sem markdown:

{
  "slides": [
    {
      "position": 1,
      "title": "Título do Slide",
      "content": "Conteúdo formatado com bullets, títulos, etc"
    },
    ...
  ]
}`;

    const userPrompt = `DADOS DO CLIENTE (contexto dos documentos):

${ragResult.contextText}

---

Gere a apresentação comercial com os ${template.slide_structure.length} slides conforme a estrutura definida.
Cada slide deve conter conteúdo personalizado com dados do cliente ou [PREENCHER] se indisponível.`;

    let slidesResponse: string;

    try {
      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      });

      slidesResponse =
        response.content[0].type === "text" ? response.content[0].text : "";

      if (!slidesResponse) {
        throw new Error("Empty response from slide generator");
      }
    } catch (error) {
      console.error("Slide generation error:", error);
      return NextResponse.json(
        {
          error: "Failed to generate slides",
          details:
            error instanceof Error ? error.message : "Unknown error occurred",
        },
        { status: 500 }
      );
    }

    // Parse JSON response
    let slides: SlideContent[] = [];

    try {
      const jsonMatch = slidesResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error(`No JSON found in response`);
      }

      const parsed = JSON.parse(jsonMatch[0]) as { slides: SlideContent[] };

      if (!parsed.slides || !Array.isArray(parsed.slides)) {
        throw new Error("Invalid slides structure in response");
      }

      slides = parsed.slides;

      if (slides.length !== template.slide_structure.length) {
        console.warn(
          `Expected ${template.slide_structure.length} slides, got ${slides.length}`
        );
      }
    } catch (parseError) {
      console.error("Slide JSON parsing error:", parseError);
      return NextResponse.json(
        {
          error: "Failed to parse generated slides",
          details:
            parseError instanceof Error
              ? parseError.message
              : "Unknown parsing error",
        },
        { status: 500 }
      );
    }

    // Step 7: Montar resultado
    const markdown = slides
      .map((slide) => `## Slide ${slide.position} — ${slide.title}\n\n${slide.content}`)
      .join("\n\n---\n\n");

    const presentation: PresentationResult = {
      templateId: classification.template_id,
      templateName: template.name,
      slides,
      markdown,
    };

    console.log(
      `[Presentation] Generated ${slides.length} slides successfully`
    );

    // Step 8: Salvar no histórico
    const presentationRecord = `[APRESENTAÇÃO GERADA - Template: ${template.name}]\n\n${markdown}`;

    try {
      await db.message.create({
        data: {
          folderId,
          role: "assistant",
          content: presentationRecord,
        },
      });

      console.log(`[Presentation] Saved to folder history`);
    } catch (dbError) {
      console.error("Error saving presentation to history:", dbError);
      // Não falhar a resposta se histórico falhar
    }

    // Step 9: Retornar resultado
    return NextResponse.json({
      presentation,
      classification,
      template: {
        id: template.id,
        name: template.name,
        positioning: template.positioning,
        tone_of_voice: template.tone_of_voice,
        brandkit: template.brandkit,
      },
    });
  } catch (error) {
    console.error("Presentation generation error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate presentation",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
