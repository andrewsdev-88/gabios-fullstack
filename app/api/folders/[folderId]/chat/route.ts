import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ragSearch } from "@/lib/rag";
import { Anthropic } from "@anthropic-ai/sdk";

interface ChatRouteContext {
  params: Promise<{
    folderId: string;
  }>;
}

/**
 * POST /api/folders/[folderId]/chat
 * Chat RAG com isolamento por folder_id
 *
 * Pipeline:
 * 1. Validar folder e query
 * 2. Gerar embedding da query
 * 3. Buscar no ChromaDB com filtro obrigatório folder_id
 * 4. Se contexto vazio → responder sem LLM
 * 5. Se contexto existe → gerar resposta via Claude com stream
 * 6. Salvar pergunta e resposta no histórico
 */
export async function POST(
  request: NextRequest,
  { params }: ChatRouteContext
) {
  const { folderId } = await params;

  try {
    const body = await request.json();
    const { message, documentIds } = body;

    // Step 1: Validar inputs
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    const userMessage = message.trim();
    if (userMessage.length === 0) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    // Step 2: Validar que a pasta existe
    const folder = await db.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    console.log(
      `[Chat] Starting RAG for folder "${folder.clientName}" (${folderId})${
        documentIds && documentIds.length > 0
          ? ` with ${documentIds.length} document(s) filtered`
          : ""
      }`
    );

    // Step 3: Buscar no ChromaDB com filtro obrigatório folder_id (+ documentIds opcional)
    let contextChunks: Array<{
      id: string;
      text: string;
      score: number;
      metadata: any;
    }> = [];

    try {
      const ragResult = await ragSearch(userMessage, folderId, {
        topK: 5,
        minScore: 0.7,
        documentIds,
      });
      contextChunks = ragResult.chunks;

      console.log(
        `[RAG] Found ${contextChunks.length} relevant chunks for folder ${folderId}`
      );
    } catch (error) {
      console.error("Error searching ChromaDB:", error);
      return NextResponse.json(
        { error: "Failed to search documents" },
        { status: 500 }
      );
    }

    // Step 5: Se contexto vazio, retornar resposta padrão
    if (contextChunks.length === 0) {
      const emptyResponse =
        "Não encontrei informações sobre isso nos documentos do cliente.";

      // Salvar pergunta e resposta no histórico
      try {
        await db.message.create({
          data: { folderId, role: "user", content: userMessage },
        });

        await db.message.create({
          data: { folderId, role: "assistant", content: emptyResponse },
        });
      } catch (dbError) {
        console.error("Error saving chat history (empty context):", dbError);
        // Não falhar a resposta se histórico falhar
      }

      return NextResponse.json({
        response: emptyResponse,
        contextChunks: 0,
        fromDocuments: false,
      });
    }

    // Step 6: Montar contexto com chunks encontrados
    const contextText = contextChunks
      .map(
        (chunk) =>
          `[Documento: ${chunk.metadata.file_name} - Chunk ${chunk.metadata.chunk_index}]\n${chunk.text}`
      )
      .join("\n\n---\n\n");

    console.log(
      `[RAG] Context assembled: ${contextChunks.length} chunks, ${contextText.length} characters`
    );

    // Step 7: Salvar pergunta no histórico
    await db.message.create({
      data: { folderId, role: "user", content: userMessage },
    });

    // Step 8: Gerar resposta via Claude com stream
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const systemPrompt = `Você é o assistente de trabalho da Gabi Produções para o cliente "${folder.clientName}".

Responda SOMENTE com base no contexto fornecido dos documentos do cliente. Se a informação não estiver no contexto, diga que não encontrou nos documentos do cliente.

Seja conciso, claro e profissional.`;

    const userPrompt = `Contexto dos documentos:

${contextText}

---

Pergunta: ${userMessage}`;

    let fullResponse = "";

    // Usar SSE para streaming
    const encoder = new TextEncoder();
    let streamStarted = false;

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const stream = await client.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1024,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }],
            stream: true,
          });

          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const text = event.delta.text;
              fullResponse += text;

              if (!streamStarted) {
                streamStarted = true;
                // Enviar header SSE na primeira chunk de texto
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ type: "start", contextChunks: contextChunks.length })}\n\n`
                  )
                );
              }

              // Enviar texto em tempo real
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "text", content: text })}\n\n`
                )
              );
            }
          }

          // Salvar resposta completa no histórico
          try {
            await db.message.create({
              data: { folderId, role: "assistant", content: fullResponse },
            });

            console.log(
              `[Chat] Conversation saved for folder ${folderId}, response length: ${fullResponse.length}`
            );
          } catch (dbError) {
            console.error("Error saving assistant response:", dbError);
          }

          // Finalizar stream
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "end", totalLength: fullResponse.length })}\n\n`
            )
          );
          controller.close();
        } catch (error) {
          console.error("Error in streaming:", error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", message: error instanceof Error ? error.message : "Unknown error" })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error processing chat:", error);

    return NextResponse.json(
      {
        error: "Failed to process chat",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
