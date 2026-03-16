'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface Folder {
  id: string;
  clientName: string;
  sector?: string;
  createdAt: string;
  documentCount: number;
  documentStatus: {
    ready: number;
    processing: number;
    error: number;
  };
  contextSummary?: string;
  contextSummaryAt?: string;
}

export default function FoldersPage() {
  const router = useRouter();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [clientName, setClientName] = useState('');
  const [sector, setSector] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchFolders();
  }, []);

  async function fetchFolders() {
    try {
      setLoading(true);
      const response = await fetch('/api/folders');
      if (!response.ok) throw new Error('Failed to fetch folders');
      const data = await response.json();
      setFolders(data.folders);
    } catch (error) {
      console.error('Error fetching folders:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateFolder(e: React.FormEvent) {
    e.preventDefault();
    if (!clientName.trim()) return;

    try {
      setCreating(true);
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientName.trim(),
          sector: sector.trim() || undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to create folder');
      const newFolder = await response.json();
      setFolders([...folders, newFolder]);
      setShowModal(false);
      setClientName('');
      setSector('');
    } catch (error) {
      console.error('Error creating folder:', error);
    } finally {
      setCreating(false);
    }
  }

  function getStatusBadge(documentStatus: Folder['documentStatus'], count: number) {
    if (count === 0) return 'Vazio';

    if (documentStatus.processing > 0) return 'Processando';
    if (documentStatus.error > 0) return 'Erro';
    if (documentStatus.ready > 0) return 'Pronto';
    return 'Vazio';
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'Pronto':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'Processando':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'Erro':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  }

  function getCompletudeColor(completude: string) {
    switch (completude) {
      case 'alta':
        return 'bg-green-500/10 text-green-400';
      case 'media':
        return 'bg-yellow-500/10 text-yellow-400';
      case 'baixa':
        return 'bg-red-500/10 text-red-400';
      default:
        return 'bg-gray-500/10 text-gray-400';
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Pastas</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 bg-gray-800 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Pastas</h1>
            <p className="text-gray-400 mt-1">
              {folders.length} {folders.length === 1 ? 'pasta' : 'pastas'} criada{folders.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            Nova Pasta
          </button>
        </div>

        {/* Empty State */}
        {folders.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-300 mb-2">
              Nenhuma pasta criada ainda
            </h2>
            <p className="text-gray-400 mb-6">
              Crie sua primeira pasta para começar
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Criar Primeira Pasta
            </button>
          </div>
        ) : (
          /* Grid de Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {folders.map((folder) => {
              const parsedSummary = folder.contextSummary
                ? JSON.parse(folder.contextSummary)
                : null;
              const status = getStatusBadge(folder.documentStatus, folder.documentCount);
              const statusIcon = getStatusIcon(status);

              return (
                <button
                  key={folder.id}
                  onClick={() => router.push(`/folders/${folder.id}`)}
                  className="text-left bg-gray-800 hover:bg-gray-750 rounded-lg p-6 transition border border-gray-700 hover:border-gray-600"
                >
                  {/* Nome do Cliente */}
                  <h3 className="text-lg font-semibold text-white mb-2 truncate">
                    {folder.clientName}
                  </h3>

                  {/* Setor Badge */}
                  {folder.sector && (
                    <div className="mb-3">
                      <span className="inline-block px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
                        {folder.sector}
                      </span>
                    </div>
                  )}

                  {/* Documentos e Status */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">
                        {folder.documentCount}{' '}
                        {folder.documentCount === 1
                          ? 'documento'
                          : 'documentos'}
                      </span>
                      <span className="text-gray-600">·</span>
                      <div className="flex items-center gap-1">
                        {statusIcon}
                        <span className="text-sm text-gray-400">{status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Context Summary */}
                  {parsedSummary && (
                    <div className="mb-4 pb-4 border-t border-gray-700">
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-1">Template</p>
                        <p className="text-sm text-blue-400">
                          {parsedSummary.template_sugerido}
                        </p>
                      </div>
                      <div className="mt-2">
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded ${getCompletudeColor(
                            parsedSummary.completude_contexto
                          )}`}
                        >
                          Contexto{' '}
                          {parsedSummary.completude_contexto === 'alta'
                            ? 'Completo'
                            : parsedSummary.completude_contexto === 'media'
                              ? 'Parcial'
                              : 'Incompleto'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Data de Criação */}
                  <div className="text-xs text-gray-500 pt-3 border-t border-gray-700">
                    {new Date(folder.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Nova Pasta */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Nova Pasta</h2>
            <form onSubmit={handleCreateFolder}>
              <div className="mb-4">
                <label className="block text-sm text-gray-300 mb-2">
                  Nome do Cliente *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Acme Consulting"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  disabled={creating}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm text-gray-300 mb-2">
                  Setor (opcional)
                </label>
                <input
                  type="text"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  placeholder="Ex: Tecnologia"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  disabled={creating}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setClientName('');
                    setSector('');
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-white transition"
                  disabled={creating}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!clientName.trim() || creating}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded transition"
                >
                  {creating ? 'Criando...' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
