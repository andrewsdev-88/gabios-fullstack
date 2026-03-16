/**
 * lib/rag.ts
 * Wrapper limpo para busca RAG com isolamento por folder_id
 *
 * Centraliza a lógica de:
 * 1. Se query vazia: buscar TODOS os chunks da pasta (getAllChunks)
 * 2. Se query existe: gerar embedding e buscar vetorial (searchChroma)
 * 3. Formatar contexto para LLM
 * 4. Suportar filtros por documentos específicos
 */

import { generateEmbedding } from "./embeddings";
import { searchChroma, getAllChunks } from "./chroma";

interface RAGOptions {
  topK?: number;
  minScore?: number;
  documentIds?: string[]; // IDs de documentos específicos para filtrar
}

interface RAGResult {
  chunks: Array<{
    id: string;
    text: string;
    score: number;
    metadata: Record<string, any>;
  }>;
  contextText: string;
  hasContext: boolean;
}

/**
 * Constrói o where filter para ChromaDB baseado em folderId e documentIds opcionais
 */
function buildWhereFilter(
  folderId: string,
  documentIds?: string[]
): Record<string, any> {
  if (documentIds && documentIds.length > 0) {
    // Filtro composto: folder_id E document_id in list
    return {
      $and: [
        {
          folder_id: {
            $eq: folderId,
          },
        },
        {
          document_id: {
            $in: documentIds,
          },
        },
      ],
    };
  }

  // Filtro simples: apenas folder_id
  return {
    folder_id: {
      $eq: folderId,
    },
  };
}

/**
 * Busca RAG com isolamento por folder_id e suporte a filtro por documentos
 *
 * Comportamento inteligente:
 * - Se query vazia: retorna TODOS os chunks da pasta (sem busca vetorial)
 * - Se query existe: busca vetorial por relevância
 * - Se documentIds fornecido: filtra apenas esses documentos
 *
 * @param query - Texto da pergunta (pode ser vazio para obter contexto completo)
 * @param folderId - ID da pasta (cliente) — aplicado como filtro obrigatório
 * @param options - topK (padrão: 5), minScore (padrão: 0.7), documentIds (opcional)
 * @returns Chunks encontrados, contexto formatado, flag de contexto
 */
export async function ragSearch(
  query: string,
  folderId: string,
  options?: RAGOptions
): Promise<RAGResult> {
  const { topK = 5, minScore = 0.7, documentIds } = options || {};

  try {
    let chunks;

    // Montar o filtro where
    const where = buildWhereFilter(folderId, documentIds);

    // Step 1: Verificar se query é vazia
    if (!query || query.trim() === "") {
      // Query vazia → buscar TODOS os chunks com o filtro
      console.log(
        `[RAG] Empty query detected — fetching all chunks for folder ${folderId} (limit: ${topK})${documentIds && documentIds.length > 0 ? ` with ${documentIds.length} document(s) filtered` : ""}`
      );

      chunks = await getAllChunks(where, topK);
    } else {
      // Query existe → fazer busca vetorial normal
      // Step 2a: Gerar embedding da query
      const queryEmbedding = await generateEmbedding(query);

      // Step 2b: Buscar no ChromaDB com filtro aplicado
      const filterDesc =
        documentIds && documentIds.length > 0
          ? `folder_id + ${documentIds.length} document(s)`
          : "folder_id only";

      console.log(
        `[RAG] Vector search for folder ${folderId} — filter applied (${filterDesc})`
      );

      chunks = await searchChroma(where, queryEmbedding, topK, minScore);
    }

    // Step 3: Montar contexto formatado pronto para LLM
    const contextText = chunks
      .map(
        (chunk) =>
          `[Documento: ${chunk.metadata.file_name} - Chunk ${chunk.metadata.chunk_index}]\n${chunk.text}`
      )
      .join("\n\n---\n\n");

    return {
      chunks,
      contextText,
      hasContext: chunks.length > 0,
    };
  } catch (error) {
    console.error("Error in RAG search:", error);
    throw new Error(
      `RAG search failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
