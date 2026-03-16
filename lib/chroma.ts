/**
 * lib/chroma.ts → Migrado para Supabase + pgvector
 * Cliente de embeddings vetoriais usando Supabase
 *
 * Armazena embeddings em tabela PostgreSQL com extensão pgvector
 * Isolamento garantido via metadados folder_id em cada chunk
 * Busca por similaridade via função PL/pgSQL
 */

import { createClient } from '@supabase/supabase-js';

interface ChunkedContent {
  text: string;
  index: number;
}

interface ChromaMetadata {
  folder_id: string;
  document_id: string;
  file_name: string;
  chunk_index: number;
}

interface EmbeddingRow {
  id: string;
  folder_id: string;
  document_id: string;
  file_name: string;
  chunk_index: number;
  content: string;
  similarity?: number;
}

// Inicializar cliente Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set'
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Adiciona embeddings ao Supabase com isolamento por folder_id
 *
 * @param folderId - ID da pasta (cliente)
 * @param documentId - ID do documento
 * @param fileName - Nome original do arquivo
 * @param chunks - Array de chunks com texto e índice
 * @param embeddings - Array de embeddings (um por chunk)
 */
export async function addEmbeddingsToChroma(
  folderId: string,
  documentId: string,
  fileName: string,
  chunks: ChunkedContent[],
  embeddings: number[][]
): Promise<void> {
  try {
    // Preparar dados para inserção
    const rows = chunks.map((chunk, idx) => ({
      id: `${documentId}:${chunk.index}`,
      folder_id: folderId,
      document_id: documentId,
      file_name: fileName,
      chunk_index: chunk.index,
      content: chunk.text,
      embedding: embeddings[idx],
    }));

    // Inserir embeddings no Supabase
    const { error } = await supabase
      .from('embeddings')
      .insert(rows);

    if (error) {
      throw new Error(`Failed to insert embeddings: ${error.message}`);
    }
  } catch (error) {
    console.error('Error adding embeddings to Supabase:', error);
    throw new Error(
      `Failed to store embeddings in Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Extrai folder_id e document_ids do objeto where
 */
function extractFilterParams(where: Record<string, any>): {
  folder_id: string;
  document_ids?: string[];
} {
  let folder_id = '';
  let document_ids: string[] | undefined;

  // Caso 1: Filtro simples { folder_id: { $eq: "..." } }
  if (where?.folder_id?.$eq) {
    folder_id = where.folder_id.$eq;
  }

  // Caso 2: Filtro composto { $and: [...] }
  if (where?.$and && Array.isArray(where.$and)) {
    for (const condition of where.$and) {
      if (condition.folder_id?.$eq) {
        folder_id = condition.folder_id.$eq;
      }
      if (condition.document_id?.$in) {
        document_ids = condition.document_id.$in;
      }
    }
  }

  if (!folder_id) {
    throw new Error('folder_id is required in where filter');
  }

  return { folder_id, document_ids };
}

/**
 * Obtém chunks conforme filtro where fornecido (versão genérica)
 *
 * @param where - Filtro ChromaDB já montado
 * @param limit - Número máximo de chunks (padrão: 20)
 */
export async function getAllChunks(
  where: Record<string, any>,
  limit: number = 20
): Promise<
  Array<{
    id: string;
    text: string;
    score: number;
    metadata: ChromaMetadata;
  }>
> {
  try {
    const { folder_id, document_ids } = extractFilterParams(where);

    // Usar função PL/pgSQL do Supabase
    const { data, error } = await supabase
      .rpc('get_embeddings_by_folder', {
        p_folder_id: folder_id,
        p_limit: limit,
      });

    if (error) {
      throw new Error(`Failed to fetch chunks: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Se document_ids foi especificado, filtrar no lado do cliente
    let filtered = data as EmbeddingRow[];
    if (document_ids && document_ids.length > 0) {
      filtered = filtered.filter((row) =>
        document_ids.includes(row.document_id)
      );
    }

    return filtered.map((row) => ({
      id: row.id,
      text: row.content,
      score: 1.0, // Sem score em busca não-vetorial
      metadata: {
        folder_id: row.folder_id,
        document_id: row.document_id,
        file_name: row.file_name,
        chunk_index: row.chunk_index,
      },
    }));
  } catch (error) {
    console.error('Error getting chunks:', error);
    throw new Error(
      `Failed to get chunks from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Obtém TODOS os chunks de uma pasta sem busca vetorial
 * Wrapper de compatibilidade com ChromaDB
 *
 * @param folderId - ID da pasta (cliente) — FILTRO CRÍTICO
 * @param limit - Número máximo de chunks (padrão: 20)
 * @param where - Filtro opcional (se não fornecido, filtra apenas por folder_id)
 */
export async function getAllChunksByFolderId(
  folderId: string,
  limit: number = 20,
  where?: Record<string, any>
): Promise<
  Array<{
    id: string;
    text: string;
    score: number;
    metadata: ChromaMetadata;
  }>
> {
  // Se where não foi fornecido, criar filtro padrão
  const finalWhere = where || {
    folder_id: {
      $eq: folderId,
    },
  };

  return getAllChunks(finalWhere, limit);
}

/**
 * Busca embeddings no Supabase conforme filtro where fornecido (versão genérica)
 *
 * @param where - Filtro ChromaDB já montado (com folder_id obrigatório)
 * @param queryEmbedding - Embedding da query
 * @param topK - Número de resultados (padrão: 5)
 * @param minScore - Score mínimo (padrão: 0.7)
 */
export async function searchChroma(
  where: Record<string, any>,
  queryEmbedding: number[],
  topK: number = 5,
  minScore: number = 0.7
): Promise<
  Array<{
    id: string;
    text: string;
    score: number;
    metadata: ChromaMetadata;
  }>
> {
  try {
    const { folder_id, document_ids } = extractFilterParams(where);

    // Usar função de busca com filtro opcionalmente composto
    const { data, error } = await supabase
      .rpc('search_embeddings_filtered', {
        p_folder_id: folder_id,
        p_query_embedding: queryEmbedding,
        p_limit: topK,
        p_min_similarity: minScore,
        p_document_ids: document_ids || null,
      });

    if (error) {
      throw new Error(`Failed to search embeddings: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    return (data as EmbeddingRow[]).map((row) => ({
      id: row.id,
      text: row.content,
      score: row.similarity || 0,
      metadata: {
        folder_id: row.folder_id,
        document_id: row.document_id,
        file_name: row.file_name,
        chunk_index: row.chunk_index,
      },
    }));
  } catch (error) {
    console.error('Error searching Supabase:', error);
    throw new Error(
      `Failed to search embeddings in Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Busca embeddings no Supabase com filtro obrigatório folder_id
 * Wrapper de compatibilidade com ChromaDB
 *
 * @param folderId - ID da pasta (cliente) — FILTRO CRÍTICO
 * @param queryEmbedding - Embedding da query
 * @param topK - Número de resultados (padrão: 5)
 * @param minScore - Score mínimo (padrão: 0.7)
 * @param where - Filtro opcional (se não fornecido, filtra apenas por folder_id)
 */
export async function searchChromaByFolderId(
  folderId: string,
  queryEmbedding: number[],
  topK: number = 5,
  minScore: number = 0.7,
  where?: Record<string, any>
): Promise<
  Array<{
    id: string;
    text: string;
    score: number;
    metadata: ChromaMetadata;
  }>
> {
  // Se where não foi fornecido, criar filtro padrão
  const finalWhere = where || {
    folder_id: {
      $eq: folderId,
    },
  };

  return searchChroma(finalWhere, queryEmbedding, topK, minScore);
}
