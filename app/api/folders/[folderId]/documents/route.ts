import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateEmbeddingsBatch } from "@/lib/embeddings";
import { addEmbeddingsToChroma } from "@/lib/chroma";
import pdf from "pdf-parse";

interface DocumentRouteContext {
  params: Promise<{
    folderId: string;
  }>;
}

/**
 * Determina o tipo de arquivo baseado na extensão
 */
function getFileType(fileName: string): string | null {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "pdf";
  if (ext === "md") return "md";
  if (ext === "txt") return "txt";
  return null;
}

/**
 * Divide o texto em chunks com sobreposição
 * chunkSize: 1000 caracteres
 * chunkOverlap: 200 caracteres
 */
function splitTextIntoChunks(
  text: string,
  chunkSize: number = 1000,
  chunkOverlap: number = 200
): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start = end - chunkOverlap;

    if (start >= text.length) break;
  }

  return chunks;
}

/**
 * POST /api/folders/[folderId]/documents
 * Upload e ingestão de documentos (PDF, MD, TXT)
 *
 * Pipeline crítico:
 * 1. Validar folder e arquivo
 * 2. Salvar Document com status "processing"
 * 3. Extrair texto
 * 4. Dividir em chunks (RecursiveCharacterTextSplitter: 1000/200)
 * 5. Gerar embeddings em lote
 * 6. Inserir no ChromaDB com metadados obrigatórios (folder_id, document_id, file_name, chunk_index)
 * 7. Atualizar status para "ready"
 * 8. Tratamento de erro em cada passo
 */
export async function POST(
  request: NextRequest,
  { params }: DocumentRouteContext
) {
  const { folderId } = await params;
  let documentId: string | null = null;

  try {
    // Step 1: Validar que a pasta existe
    const folder = await db.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    // Step 2: Parse multipart/form-data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const fileName = file.name;
    const fileType = getFileType(fileName);

    if (!fileType) {
      return NextResponse.json(
        { error: "Only PDF, MD, and TXT files are supported" },
        { status: 400 }
      );
    }

    // Step 3: Salvar Document com status "processing"
    const document = await db.document.create({
      data: {
        folderId,
        fileName,
        fileType,
        status: "processing",
      },
    });

    documentId = document.id;
    console.log(
      `[Document ${documentId}] Starting ingestion for "${fileName}"...`
    );

    // Step 4: Extrair texto do arquivo
    let text: string;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (fileType === "pdf") {
        try {
          const pdfData = await pdf(buffer);
          text = pdfData.text;
        } catch (pdfError) {
          throw new Error(
            `PDF parsing failed: ${pdfError instanceof Error ? pdfError.message : "Unknown error"}`
          );
        }
      } else {
        // MD or TXT
        text = buffer.toString("utf-8");
      }

      if (!text || text.trim().length === 0) {
        throw new Error("File is empty or could not be parsed");
      }

      console.log(
        `[Document ${documentId}] Extracted ${text.length} characters`
      );
    } catch (error) {
      throw new Error(
        `Text extraction failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }

    // Step 5: Dividir em chunks
    let chunks: string[];

    try {
      chunks = splitTextIntoChunks(text, 1000, 200);

      if (chunks.length === 0) {
        throw new Error("No chunks generated from file");
      }

      console.log(`[Document ${documentId}] Created ${chunks.length} chunks`);
    } catch (error) {
      throw new Error(
        `Chunking failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }

    // Step 6: Gerar embeddings em lote
    let embeddings: number[][];

    try {
      embeddings = await generateEmbeddingsBatch(chunks);

      if (embeddings.length !== chunks.length) {
        throw new Error(
          `Embedding count mismatch: ${embeddings.length} embeddings for ${chunks.length} chunks`
        );
      }

      console.log(
        `[Document ${documentId}] Generated ${embeddings.length} embeddings`
      );
    } catch (error) {
      throw new Error(
        `Embedding generation failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }

    // Step 7: Inserir no ChromaDB com metadados OBRIGATÓRIOS
    try {
      const chunksWithIndex = chunks.map((text, index) => ({
        text,
        index,
      }));

      await addEmbeddingsToChroma(
        folderId,
        documentId,
        fileName,
        chunksWithIndex,
        embeddings
      );

      console.log(
        `[Document ${documentId}] Inserted into ChromaDB with folder_id isolation`
      );
    } catch (error) {
      throw new Error(
        `ChromaDB insertion failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }

    // Step 8: Atualizar status para "ready"
    const updatedDocument = await db.document.update({
      where: { id: documentId },
      data: { status: "ready" },
    });

    console.log(`[Document ${documentId}] Status updated to "ready"`);

    return NextResponse.json(
      {
        id: updatedDocument.id,
        fileName: updatedDocument.fileName,
        fileType: updatedDocument.fileType,
        status: updatedDocument.status,
        chunkCount: chunks.length,
        embeddingCount: embeddings.length,
        createdAt: updatedDocument.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    // Tratamento de erro: marcar documento como "error" com mensagem descritiva
    if (documentId) {
      const errorMsg =
        error instanceof Error ? error.message : "Unknown error occurred";

      try {
        await db.document.update({
          where: { id: documentId },
          data: {
            status: "error",
            errorMsg,
          },
        });

        console.error(
          `[Document ${documentId}] Marked as error: ${errorMsg}`
        );
      } catch (updateError) {
        console.error(
          `[Document ${documentId}] Failed to update error status:`,
          updateError
        );
      }
    }

    console.error("Document ingestion error:", error);

    return NextResponse.json(
      {
        error: "Failed to upload and process document",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
