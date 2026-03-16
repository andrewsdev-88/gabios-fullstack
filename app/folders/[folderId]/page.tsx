'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Upload, Loader, CheckCircle, AlertCircle, RefreshCw, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Document {
  id: string;
  fileName: string;
  fileType: string;
  status: 'processing' | 'ready' | 'error';
  errorMsg?: string;
}

interface Folder {
  id: string;
  clientName: string;
  sector?: string;
  documents: Document[];
  contextSummary?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface FolderPageProps {
  params: Promise<{
    folderId: string;
  }>;
}

export default function FolderPage({ params }: FolderPageProps) {
  const [folderId, setFolderId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setFolderId(p.folderId));
  }, [params]);
  const [folder, setFolder] = useState<Folder | null>(null);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoadingFolder, setIsLoadingFolder] = useState(true);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isGeneratingPresentation, setIsGeneratingPresentation] = useState(false);
  const [presentationMarkdown, setPresentationMarkdown] = useState('');
  const [isUpdatingBriefing, setIsUpdatingBriefing] = useState(false);
  const [uploadingFileId, setUploadingFileId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (folderId) {
      fetchFolder();
    }
  }, [folderId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function fetchFolder() {
    try {
      setIsLoadingFolder(true);
      const response = await fetch(`/api/folders/${folderId}`);
      if (!response.ok) throw new Error('Failed to fetch folder');
      const data = await response.json();
      setFolder(data);
      setMessages([]);
      setPresentationMarkdown('');
    } catch (error) {
      console.error('Error fetching folder:', error);
    } finally {
      setIsLoadingFolder(false);
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!inputMessage.trim() || isSendingMessage || !folder) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsSendingMessage(true);

    let assistantResponse = '';

    try {
      const response = await fetch(`/api/folders/${folderId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          documentIds: selectedDocumentIds.length > 0 ? selectedDocumentIds : undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;

          try {
            const event = JSON.parse(line.slice(6));

            if (event.type === 'text') {
              assistantResponse += event.content;
              setMessages((prev) => {
                const updated = [...prev];
                if (
                  updated.length > 0 &&
                  updated[updated.length - 1].role === 'assistant'
                ) {
                  updated[updated.length - 1].content = assistantResponse;
                } else {
                  updated.push({ role: 'assistant', content: assistantResponse });
                }
                return updated;
              });
            }
          } catch (e) {
            // Ignorar eventos malformados
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Erro ao processar sua mensagem.' },
      ]);
    } finally {
      setIsSendingMessage(false);
    }
  }

  async function handleUpdateBriefing() {
    if (!folder) return;

    try {
      setIsUpdatingBriefing(true);
      const response = await fetch(`/api/folders/${folderId}/context-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentIds: selectedDocumentIds.length > 0 ? selectedDocumentIds : undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to update briefing');
      const data = await response.json();

      if (data.summary) {
        setFolder((prev) =>
          prev
            ? {
                ...prev,
                contextSummary: JSON.stringify(data.summary),
              }
            : null
        );
      }
    } catch (error) {
      console.error('Error updating briefing:', error);
    } finally {
      setIsUpdatingBriefing(false);
    }
  }

  async function handleGeneratePresentation() {
    if (!folder) return;

    try {
      setIsGeneratingPresentation(true);
      setPresentationMarkdown('');
      const response = await fetch(`/api/folders/${folderId}/deliverables/presentation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentIds: selectedDocumentIds.length > 0 ? selectedDocumentIds : undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate presentation');
      const data = await response.json();
      setPresentationMarkdown(data.presentation.markdown);
    } catch (error) {
      console.error('Error generating presentation:', error);
      setPresentationMarkdown('Erro ao gerar apresentação. Tente novamente.');
    } finally {
      setIsGeneratingPresentation(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.currentTarget.files;
    if (!files || files.length === 0 || !folder) return;

    const file = files[0];
    const fileId = `temp-${Date.now()}`;
    setUploadingFileId(fileId);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/folders/${folderId}/documents`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload file');
      await fetchFolder();
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploadingFileId(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  if (!folderId || isLoadingFolder) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center text-white">
        Pasta não encontrada
      </div>
    );
  }

  const parsedSummary = folder.contextSummary
    ? JSON.parse(folder.contextSummary)
    : null;

  return (
    <div className="h-screen bg-gray-900 flex overflow-hidden">
      {/* Coluna Esquerda — Documentos (240px) */}
      <div className="w-60 border-r border-gray-700 bg-gray-800 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-sm font-semibold text-white mb-3">Fontes</h2>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingFileId !== null}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-sm rounded transition"
          >
            <Upload className="w-4 h-4" />
            Adicionar
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.md,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {folder.documents.length === 0 ? (
            <div className="p-4 text-xs text-gray-500 text-center">
              Nenhum documento ainda
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {folder.documents.map((doc) => (
                <label
                  key={doc.id}
                  className="flex items-start gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedDocumentIds.includes(doc.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDocumentIds([...selectedDocumentIds, doc.id]);
                      } else {
                        setSelectedDocumentIds(
                          selectedDocumentIds.filter((id) => id !== doc.id)
                        );
                      }
                    }}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">
                      {doc.fileName}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {doc.status === 'ready' && (
                        <CheckCircle className="w-3 h-3 text-green-400" />
                      )}
                      {doc.status === 'processing' && (
                        <Loader className="w-3 h-3 text-yellow-400 animate-spin" />
                      )}
                      {doc.status === 'error' && (
                        <AlertCircle className="w-3 h-3 text-red-400" />
                      )}
                      <span className="text-xs text-gray-400">
                        {doc.status === 'ready'
                          ? 'Pronto'
                          : doc.status === 'processing'
                            ? 'Processando'
                            : 'Erro'}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {selectedDocumentIds.length > 0 && (
          <div className="p-3 border-t border-gray-700 bg-blue-900/20 text-xs text-blue-300">
            {selectedDocumentIds.length} documento{selectedDocumentIds.length !== 1 ? 's' : ''} selecionado{selectedDocumentIds.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Coluna Central — Chat (flex) */}
      <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-700">
        {/* Header */}
        <div className="h-16 border-b border-gray-700 bg-gray-800 px-6 flex items-center">
          <h1 className="text-lg font-semibold text-white">{folder.clientName}</h1>
        </div>

        {/* Context Summary Card */}
        {parsedSummary && (
          <div className="px-6 pt-4 pb-4 border-b border-gray-700">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">Briefing</h3>
                <button
                  onClick={handleUpdateBriefing}
                  disabled={isUpdatingBriefing}
                  className="p-1 hover:bg-gray-700 rounded transition disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 text-blue-400 ${
                      isUpdatingBriefing ? 'animate-spin' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-2 text-sm">
                {parsedSummary.dores_identificadas && (
                  <div>
                    <p className="text-xs text-gray-400">Dores</p>
                    <p className="text-gray-300">
                      {parsedSummary.dores_identificadas.join(', ')}
                    </p>
                  </div>
                )}
                {parsedSummary.tom_de_voz_percebido && (
                  <div>
                    <p className="text-xs text-gray-400">Tom</p>
                    <p className="text-gray-300">
                      {parsedSummary.tom_de_voz_percebido}
                    </p>
                  </div>
                )}
                {parsedSummary.template_sugerido && (
                  <div>
                    <p className="text-xs text-gray-400">Template</p>
                    <p className="text-blue-400">{parsedSummary.template_sugerido}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && !parsedSummary && (
            <div className="h-full flex items-center justify-center text-gray-500 text-center">
              <div>
                <p className="text-sm mb-2">Nenhuma mensagem ainda</p>
                <p className="text-xs">Envie uma mensagem para começar</p>
              </div>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : ''}`}>
              <div
                className={`max-w-sm px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-200 border border-gray-700'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div className="text-sm prose prose-invert max-w-none">
                    <ReactMarkdown>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
              </div>
            </div>
          ))}
          {isSendingMessage && (
            <div className="flex">
              <div className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg">
                <Loader className="w-4 h-4 text-blue-400 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form
          onSubmit={handleSendMessage}
          className="border-t border-gray-700 bg-gray-800 p-4"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Digite sua pergunta..."
              disabled={isSendingMessage}
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isSendingMessage}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded transition flex items-center justify-center"
            >
              {isSendingMessage ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Coluna Direita — Entregáveis (280px) */}
      <div className="w-72 bg-gray-800 border-l border-gray-700 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-sm font-semibold text-white mb-3">Entregáveis</h2>
          <button
            onClick={handleGeneratePresentation}
            disabled={isGeneratingPresentation || folder.documents.length === 0}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-sm rounded transition"
          >
            {isGeneratingPresentation ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            Gerar Apresentação
          </button>

          {selectedDocumentIds.length > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              {selectedDocumentIds.length} fonte{selectedDocumentIds.length !== 1 ? 's' : ''}
            </p>
          )}
          {selectedDocumentIds.length === 0 && folder.documents.length > 0 && (
            <p className="text-xs text-gray-400 mt-2">Todas as fontes</p>
          )}
        </div>

        {/* Presentation Result */}
        {presentationMarkdown && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="prose prose-invert max-w-none text-xs">
              <ReactMarkdown>{presentationMarkdown}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Coming Soon Badges */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          <div className="px-3 py-2 bg-gray-700/50 rounded text-xs text-gray-400 text-center">
            🎨 BrandKit em breve
          </div>
          <div className="px-3 py-2 bg-gray-700/50 rounded text-xs text-gray-400 text-center">
            ✍️ Copy em breve
          </div>
          <div className="px-3 py-2 bg-gray-700/50 rounded text-xs text-gray-400 text-center">
            📊 Funil em breve
          </div>
        </div>
      </div>
    </div>
  );
}
