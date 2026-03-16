/**
 * lib/embeddings.ts
 * Wrapper para geração de embeddings via OpenAI (text-embedding-3-small)
 */

import { OpenAIEmbeddings } from "@langchain/openai";

let embeddingsClient: OpenAIEmbeddings | null = null;

/**
 * Obtém ou inicializa o cliente de embeddings (singleton)
 */
function getEmbeddingsClient(): OpenAIEmbeddings {
  if (!embeddingsClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }

    embeddingsClient = new OpenAIEmbeddings({
      apiKey,
      model: "text-embedding-3-small",
    });
  }

  return embeddingsClient;
}

/**
 * Gera embedding para um texto individual
 *
 * @param text - Texto a ser embedido
 * @returns Array de números representando o embedding
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const client = getEmbeddingsClient();
    const embedding = await client.embedQuery(text);
    return embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error(
      `Failed to generate embedding: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Gera embeddings para múltiplos textos em lote (mais eficiente)
 *
 * @param texts - Array de textos
 * @returns Array de embeddings
 */
export async function generateEmbeddingsBatch(
  texts: string[]
): Promise<number[][]> {
  try {
    if (texts.length === 0) {
      return [];
    }

    const client = getEmbeddingsClient();
    const embeddings = await client.embedDocuments(texts);
    return embeddings;
  } catch (error) {
    console.error("Error generating embeddings batch:", error);
    throw new Error(
      `Failed to generate embeddings batch: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
