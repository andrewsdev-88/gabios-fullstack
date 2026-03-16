import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ragSearch } from "@/lib/rag";
import { Anthropic } from "@anthropic-ai/sdk";

interface ContextSummaryRouteContext {
  params: Promise<{
    folderId: string;
  }>;
}

interface ContextSummaryData {
  cliente: string;
  setor: string;
  dores_identificadas: string[];
  tom_de_voz_percebido: string;
  oportunidade_principal: string;
  template_sugerido: string;
  completude_contexto: "baixa" | "media" | "alta";
}

/**
 * POST /api/folders/[folderId]/context-summary
 * Gera um briefing executivo baseado no contexto dos documentos
 *
 * Pipeline:
 * 1. Validar pasta
 * 2. Verificar se há documentos "ready"
 * 3. Buscar contexto completo (ragSearch)
 * 4. Analisar com Claude
 * 5. Salvar no banco
 * 6. Retornar resumo
 */
export async function POST(
  request: NextRequest,
  { params }: ContextSummaryRouteContext
) {
  const { folderId } = await params;

  try {
    const body = await request.json();
    const { documentIds } = body || {};

    // Step 1: Validar pasta
    console.log(
      `[ContextSummary] Starting for folder ${folderId}${
        documentIds && documentIds.length > 0
          ? ` with ${documentIds.length} document(s) filtered`
          : ""
      }`
    );

    const folder = await db.folder.findUnique({
      where: { id: folderId },
      include: {
        documents: {
          select: { id: true, status: true },
        },
      },
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    // Step 2: Verificar se há documentos "ready"
    const readyDocuments = folder.documents.filter((d) => d.status === "ready");

    if (readyDocuments.length === 0) {
      return NextResponse.json({
        summary: null,
        reason: "no_documents",
      });
    }

    console.log(
      `[ContextSummary] Found ${readyDocuments.length} ready documents`
    );

    // Step 3: Buscar contexto completo (com filtro opcional por documentIds)
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

    if (!ragResult.hasContext) {
      return NextResponse.json({
        summary: null,
        reason: "no_context",
      });
    }

    console.log(
      `[ContextSummary] Context retrieved: ${ragResult.chunks.length} chunks`
    );

    // Step 4: Analisar com Claude
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const systemPrompt = `Você é um analista de clientes da Gabi Produções.
Com base nos documentos do cliente, extraia as informações em um briefing executivo.
Responda APENAS em JSON válido, sem markdown ou comentários adicionais:
{
  "cliente": string,
  "setor": string,
  "dores_identificadas": string[] (máx 3),
  "tom_de_voz_percebido": string (1 frase),
  "oportunidade_principal": string (1 frase),
  "template_sugerido": string (nome do template mais adequado),
  "completude_contexto": "baixa" | "media" | "alta"
}`;

    const userPrompt = `Dados do cliente:
Nome: ${folder.clientName}
Setor: ${folder.sector || "Não especificado"}

Documentos do cliente:
${ragResult.contextText}

---

Gere o briefing executivo em JSON.`;

    let summaryResponse: string;

    try {
      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 512,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      });

      summaryResponse =
        response.content[0].type === "text" ? response.content[0].text : "";

      if (!summaryResponse) {
        throw new Error("Empty response from summary generator");
      }
    } catch (error) {
      console.error("Summary generation error:", error);
      return NextResponse.json(
        {
          error: "Failed to generate summary",
          details:
            error instanceof Error ? error.message : "Unknown error occurred",
        },
        { status: 500 }
      );
    }

    // Parse JSON response
    let summary: ContextSummaryData;

    try {
      const jsonMatch = summaryResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      summary = JSON.parse(jsonMatch[0]) as ContextSummaryData;

      // Validar campos obrigatórios
      if (
        !summary.cliente ||
        !summary.setor ||
        !Array.isArray(summary.dores_identificadas) ||
        !summary.tom_de_voz_percebido ||
        !summary.oportunidade_principal ||
        !summary.template_sugerido ||
        !summary.completude_contexto
      ) {
        throw new Error("Incomplete summary structure");
      }
    } catch (parseError) {
      console.error("Summary JSON parsing error:", parseError);
      return NextResponse.json(
        {
          error: "Failed to parse summary",
          details:
            parseError instanceof Error
              ? parseError.message
              : "Unknown parsing error",
        },
        { status: 500 }
      );
    }

    // Step 5: Salvar no banco
    const now = new Date();

    try {
      await db.folder.update({
        where: { id: folderId },
        data: {
          contextSummary: JSON.stringify(summary),
          contextSummaryAt: now,
        },
      });

      console.log(`[ContextSummary] Saved to folder ${folderId}`);
    } catch (dbError) {
      console.error("Error saving context summary:", dbError);
      return NextResponse.json(
        { error: "Failed to save summary" },
        { status: 500 }
      );
    }

    // Step 6: Retornar resultado
    return NextResponse.json({
      summary,
      updatedAt: now,
    });
  } catch (error) {
    console.error("Context summary error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate context summary",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
