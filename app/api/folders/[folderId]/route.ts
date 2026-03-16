import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface FolderRouteContext {
  params: Promise<{
    folderId: string;
  }>;
}

/**
 * GET /api/folders/[folderId]
 * Retorna a pasta com seus documentos e histórico de mensagens
 */
export async function GET(
  _request: NextRequest,
  { params }: FolderRouteContext
) {
  const { folderId } = await params;

  try {
    const folder = await db.folder.findUnique({
      where: { id: folderId },
      include: {
        documents: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            status: true,
            errorMsg: true,
            createdAt: true,
          },
        },
        messages: {
          select: {
            id: true,
            role: true,
            content: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: folder.id,
      clientName: folder.clientName,
      sector: folder.sector,
      notes: folder.notes,
      createdAt: folder.createdAt,
      contextSummary: folder.contextSummary,
      contextSummaryAt: folder.contextSummaryAt,
      documents: folder.documents,
      messages: folder.messages,
    });
  } catch (error) {
    console.error('Error fetching folder:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch folder',
        details:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
