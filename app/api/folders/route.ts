import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/folders
 * Lista todas as pastas de clientes com contagem de documentos
 */
export async function GET(_request: NextRequest) {
  try {
    const folders = await db.folder.findMany({
      include: {
        documents: {
          select: { id: true, status: true },
        },
        messages: {
          select: { id: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Formata resposta com metadata
    const foldersWithStats = folders.map((folder) => {
      let contextSummary = null;
      try {
        if (folder.contextSummary) {
          contextSummary = JSON.parse(folder.contextSummary);
        }
      } catch (e) {
        // Se não conseguir fazer parse, deixa como null
        contextSummary = null;
      }

      return {
        id: folder.id,
        clientName: folder.clientName,
        sector: folder.sector,
        notes: folder.notes,
        createdAt: folder.createdAt,
        documentCount: folder.documents.length,
        documentStatus: {
          ready: folder.documents.filter((d) => d.status === "ready").length,
          processing: folder.documents.filter(
            (d) => d.status === "processing"
          ).length,
          error: folder.documents.filter((d) => d.status === "error").length,
        },
        messageCount: folder.messages.length,
        contextSummary,
        contextSummaryAt: folder.contextSummaryAt,
      };
    });

    return NextResponse.json({ folders: foldersWithStats });
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json(
      { error: "Failed to fetch folders" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/folders
 * Cria uma nova pasta de cliente
 *
 * Body: {
 *   clientName: string (obrigatório)
 *   sector?: string
 *   notes?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validação
    if (!body.clientName || typeof body.clientName !== "string") {
      return NextResponse.json(
        { error: "clientName is required and must be a string" },
        { status: 400 }
      );
    }

    const clientName = body.clientName.trim();
    if (clientName.length === 0) {
      return NextResponse.json(
        { error: "clientName cannot be empty" },
        { status: 400 }
      );
    }

    // Criar pasta
    const folder = await db.folder.create({
      data: {
        clientName,
        sector: body.sector?.trim() || null,
        notes: body.notes?.trim() || null,
      },
    });

    return NextResponse.json(
      {
        id: folder.id,
        clientName: folder.clientName,
        sector: folder.sector,
        notes: folder.notes,
        createdAt: folder.createdAt,
        documentCount: 0,
        messageCount: 0,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json(
      { error: "Failed to create folder" },
      { status: 500 }
    );
  }
}
