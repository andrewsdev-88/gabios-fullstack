/**
 * lib/classifier.ts
 * Classificação automática de cliente em um dos 9 templates
 *
 * Baseado em análise via Claude dos eixos:
 * - Razão/Emoção: como o cliente toma decisões
 * - Maturidade: estado de consolidação da marca
 *
 * Fallback seguro: Template 5 (Regional Aspiracional) se classificação falhar
 */

import { Anthropic } from "@anthropic-ai/sdk";

export interface ClassificationResult {
  template_id: number;
  template_name: string;
  eixo_razao_emocao: "razao_alta" | "razao_media" | "emocao_alta";
  eixo_maturidade: "imatura" | "media" | "madura";
  justificativa: string;
}

/**
 * Classifica o cliente nos 9 templates
 *
 * @param contextText - Contexto dos documentos do cliente (chunks RAG)
 * @returns Classificação com template_id, nome, eixos e justificativa
 */
export async function classifyClient(
  contextText: string
): Promise<ClassificationResult> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const systemPrompt = `Você é um estrategista de marketing especialista em posicionamento de marcas.
Analise os dados do cliente e classifique-o nos seguintes eixos:

EIXO 1 — Como o cliente toma decisões?
- razao_alta: decide por ROI, dados, processo, resultados mensuráveis
- emocao_alta: decide por estética, propósito, status, pertencimento
- razao_media: misto

EIXO 2 — Qual a maturidade visual do cliente?
- imatura: sem identidade consolidada, marca amadora ou inexistente
- media: identidade existente mas inconsistente
- madura: design system ou identidade visual profissional consistente

REGRAS DE SELEÇÃO DE TEMPLATE:
01 Educativo Consultivo    → razao_alta + imatura     (PME local, varejo, alimentação)
02 Técnico Infográfico     → razao_alta + media        (e-commerce, performance, franquias)
03 Executivo Estratégico   → razao_alta + madura       (médias empresas, C-level)
04 Confiança Relacional    → razao_media + media       (saúde, jurídico, educação, financeiro)
05 Regional Aspiracional   → centro / transição        (PME local com ambição de crescer)
06 Storyteller Narrativo   → emocao_alta + imatura     (ONGs, causas, negócios de impacto)
07 Quiet Luxury            → emocao_alta + madura      (imóveis premium, luxo, estética)
08 Vanguardista            → emocao_alta + imatura     (e-sports, streetwear, Gen Z)
09 Dinâmico Imersivo       → emocao_alta + madura      (UX/UI, apps, social commerce, vídeo)

Responda APENAS em JSON válido, sem markdown ou comentários:
{
  "template_id": number,
  "template_name": string,
  "eixo_razao_emocao": string,
  "eixo_maturidade": string,
  "justificativa": string
}`;

  const userPrompt = `Dados do cliente (contexto dos documentos):

${contextText}

Classifique este cliente no template apropriado com base nos eixos definidos.`;

  try {
    console.log("[Classifier] Starting classification...");

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 256,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    // Extrair texto da resposta
    const responseText =
      response.content[0].type === "text" ? response.content[0].text : "";

    if (!responseText) {
      throw new Error("Empty response from classifier");
    }

    // Parse JSON — tenta encontrar objeto JSON na resposta
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error(`No JSON found in response: ${responseText}`);
    }

    const parsed = JSON.parse(jsonMatch[0]) as ClassificationResult;

    // Validar campos obrigatórios
    if (
      !parsed.template_id ||
      !parsed.template_name ||
      !parsed.eixo_razao_emocao ||
      !parsed.eixo_maturidade ||
      !parsed.justificativa
    ) {
      throw new Error("Incomplete classification result");
    }

    console.log(
      `[Classifier] Template selecionado: ${parsed.template_id} - ${parsed.template_name}`
    );

    return parsed;
  } catch (error) {
    console.error("Classification error, using fallback template 5:", error);

    // Fallback seguro: Template 5 (Regional Aspiracional)
    // Mais neutro e genérico — funciona para transições e contextos incertos
    const fallback: ClassificationResult = {
      template_id: 5,
      template_name: "Regional Aspiracional",
      eixo_razao_emocao: "razao_media",
      eixo_maturidade: "media",
      justificativa:
        "Fallback seguro: contexto insuficiente para classificação precisa. Template neutro escolhido.",
    };

    console.log(
      `[Classifier] Template selecionado (fallback): ${fallback.template_id} - ${fallback.template_name}`
    );

    return fallback;
  }
}
