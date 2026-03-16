# DEV_HANDOFF.md — Gabios

> Documento de referência técnica para qualquer dev que entrar no projeto.  
> Mantido junto ao código. Quando mudar algo estrutural, atualize aqui.

---

## 1. O que é o Gabios?

**Gabios** é a plataforma interna da **Gabi Produções** — uma produtora de video/conteúdo — para criar entregas comerciais automatizadas a partir de documentos de clientes.

O vendedor sobe PDFs/textos de um cliente, e a IA gera:
- **Chat** consultivo com contexto dos documentos  
- **Apresentação comercial** de 10 slides (personalizada por template de posicionamento)  
- **Resumo executivo** de briefing  

---

## 2. Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript strict |
| Banco relacional | **SQLite local** via Prisma ORM |
| Banco vetorial | **pgvector no Supabase** (tabela `embeddings`) |
| LLM | Anthropic Claude (`claude-sonnet-4-20250514`) |
| Embeddings | `text-embedding-3-small` (OpenAI) |
| Upload | FormData direto (sem storage externo) |
| UI | Tailwind CSS puro |

---

## 3. Variáveis de Ambiente Obrigatórias

```env
# Banco relacional (SQLite local)
DATABASE_URL=file:./prisma/dev.db

# Supabase — usado APENAS para pgvector (embeddings)
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# AI
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
```

**Atenção:** `chroma.ts` faz `throw` no módulo se `SUPABASE_URL` ou `SUPABASE_SERVICE_ROLE_KEY` não estiverem definidas — o servidor não inicia sem elas.

---

## 4. Modelo de Dados (Prisma)

```
SQLite local (gerenciado pelo Prisma)

Folder (cliente)
  ├── id, name, clientName, sector
  ├── contextSummary (JSON text), contextSummaryAt
  └── messages[]   ← histórico de chat + entregas

Document (arquivo do cliente)
  ├── id, folderId, fileName, fileUrl
  ├── status: "pending" | "processing" | "ready" | "error"
  └── errorMessage?

Supabase (somente embeddings — fora do Prisma)
  tabela: embeddings
  ├── id: `${documentId}:${chunkIndex}`
  ├── folder_id, document_id, file_name, chunk_index
  ├── content (texto)
  └── embedding (vector pgvector)
```

Rode `npx prisma generate && npx prisma db push` após clonar.

---

## 5. Fluxo de Ingestão de Documentos

```
Upload do arquivo (Vercel Blob)
        ↓
POST /api/folders/[folderId]/documents
  → status: "pending" → "processing" → "ready" / "error"
        ↓
1. Extrair texto do arquivo (PDF parse ou texto puro)
2. Chunking: ~500 tokens com overlap
3. generateEmbedding() → OpenAI text-embedding-3-small
4. addEmbeddingsToChroma() → Supabase/pgvector
5. db.document.update status = "ready"
```

**Arquivo:** `app/api/folders/[folderId]/documents/route.ts`  
**Libs:** `lib/embeddings.ts`, `lib/chroma.ts`

---

## 6. Sistema RAG (`lib/rag.ts`)

Wrapper unificado usado por **todas** as features de geração.

```typescript
ragSearch(query, folderId, options?)
  // query vazia → getAllChunks() (busca textual, sem embedding)
  // query preenchida → generateEmbedding() + searchChroma() (similaridade cosseno)
  // options: { topK?, minScore?, documentIds? }
  // Retorna: { chunks[], contextText, hasContext }
```

**Isolamento por pasta:** Todo chunk tem `folder_id`. O filtro é sempre aplicado.  
**Filtro por documento:** Passando `documentIds`, restringe a subset de arquivos.

Para **apresentação** e **context-summary**: `ragSearch("", folderId, { topK: 20, minScore: 0 })` — sem busca vetorial, pega tudo.  
Para **chat**: `ragSearch(userMessage, folderId, { topK: 5, minScore: 0.7 })` — busca semântica.

---

## 7. Sistema de Classificação (`lib/classifier.ts`)

Classifica o cliente em **1 de 9 templates de posicionamento** via Claude.

### Os 9 Templates

| ID | Nome | Eixo Razão/Emoção | Maturidade | Perfil |
|---|---|---|---|---|
| 01 | Educativo Consultivo | razao_alta | imatura | PME local, varejo, alimentação |
| 02 | Técnico Infográfico | razao_alta | media | e-commerce, performance, franquias |
| 03 | Executivo Estratégico | razao_alta | madura | médias empresas, C-level |
| 04 | Confiança Relacional | razao_media | media | saúde, jurídico, educação, financeiro |
| 05 | Regional Aspiracional | centro | transição | PME local com ambição de crescer |
| 06 | Storyteller Narrativo | emocao_alta | imatura | ONGs, causas, negócios de impacto |
| 07 | Quiet Luxury | emocao_alta | madura | imóveis premium, luxo, estética |
| 08 | Vanguardista | emocao_alta | imatura | e-sports, streetwear, Gen Z |
| 09 | Dinâmico Imersivo | emocao_alta | madura | UX/UI, apps, social commerce, vídeo |

**Fallback seguro:** Template 5 (Regional Aspiracional) se a classificação falhar.

### Como funciona

```
contextText → Claude (max_tokens: 256) → ClassificationResult {
  template_id, template_name,
  eixo_razao_emocao, eixo_maturidade,
  justificativa
}
```

---

## 8. Rotas da API

### `POST /api/folders/[folderId]/chat` — Chat consultivo
```
Body: { message: string, documentIds?: string[] }

Pipeline:
1. Buscar histórico de mensagens (últimas 20)
2. ragSearch(message, folderId, { topK: 5, minScore: 0.7, documentIds? })
3. Claude streaming (claude-sonnet-4-20250514)
   → system: persona da Gabi Produções + contexto RAG
4. Retornar ReadableStream (SSE)
5. Salvar user + assistant messages no DB após stream
```

### `POST /api/folders/[folderId]/documents` — Upload + ingestão
```
Body: FormData com arquivo

Pipeline:
1. Receber arquivo e validar tipo
2. Upload para Vercel Blob
3. Criar db.document com status: "pending"
4. Processar de forma assíncrona (pode ser lento):
   a. Extrair texto
   b. Chunking
   c. Gerar embeddings
   d. Salvar no Supabase/pgvector
   e. Atualizar status → "ready"
```

### `POST /api/folders/[folderId]/deliverables/presentation` — Apresentação
```
Body: { documentIds?: string[] }

Pipeline:
1. Validar folder
2. ragSearch("", folderId, { topK: 20, minScore: 0 })
3. classifyClient(contextText) → template_id
4. Carregar estrutura TEMPLATES[template_id]
5. Claude (max_tokens: 4096) → 10 slides em JSON
6. Montar resultado + markdown
7. Salvar no db.message (histórico)
```

### `POST /api/folders/[folderId]/context-summary` — Briefing executivo
```
Body: { documentIds?: string[] }

Pipeline:
1. Validar folder + verificar docs "ready"
2. ragSearch("", folderId, { topK: 20, minScore: 0 })
3. Claude (max_tokens: 512) → JSON estruturado com:
   cliente, setor, dores_identificadas[], tom_de_voz_percebido,
   oportunidade_principal, template_sugerido, completude_contexto
4. Salvar em folder.contextSummary + contextSummaryAt
```

---

## 9. Padrões de Código

### Commits
Seguem Conventional Commits:
```
feat(scope): descrição
fix(scope): descrição
refactor(scope): ...
docs(scope): ...
```

### Arquivos de lib
- Sempre com JSDoc no topo explicando responsabilidade
- `console.log` com prefixo `[NomeDoModulo]`
- Erros tratados com bloco `try/catch` explícito
- Fallback definido para toda integração externa

### Parse de JSON da LLM
Sempre usar `match(/\{[\s\S]*\}/)` antes do `JSON.parse` para tolerar texto extra na resposta.

---

## 10. Como Rodar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Copiar e preencher envs
cp .env.example .env.local

# 3. Sincronizar schema do banco
npx prisma generate
npx prisma db push

# 4. Rodar dev server
npm run dev
```

Acesse `http://localhost:3000`.

A tabela `embeddings` com coluna `vector` precisa ser criada manualmente no Supabase com a extensão `pgvector` ativa. Peça ao responsável pelo banco o script de criação ou verifique `lib/chroma.ts` para a estrutura esperada.

---

## 11. Roadmap Aberto

| Prioridade | Item |
|---|---|
| Alta | Export do slide `.pptx` no frontend |
| Alta | Webhook de status de processamento de documento |
| Média | Multi-tenancy (múltiplos usuários por conta) |
| Média | Preview live dos slides gerados |
| Baixa | Template editor (criação de novos templates sem código) |

Consulte `ROADMAP.md` para o estado atual detalhado.

---

## 12. Contato

Qualquer dúvida sobre regras de negócio (templates, posicionamento, tom de voz), falar com a **Gabi** diretamente.  
Dúvidas técnicas de ambiente, ver seção 3 e verificar com quem fez o setup inicial do Supabase.
