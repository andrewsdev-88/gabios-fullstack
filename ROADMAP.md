# GabiOS Roadmap

## Visão Geral

GabiOS é o sistema operacional da Gabi Produções — uma plataforma onde cada pasta de cliente é um workspace de inteligência. A IA lê os dados daquele cliente específico e gera entregáveis reais de agência.

**Princípio Core:** Isolamento total entre pastas + classificação automática de cliente + geração inteligente de entregáveis.

---

## Fase 1 — MVP Core (EM CONSTRUÇÃO)

**Escopo:** Funcionalidade mínima viável completa

### 1.1 — Scaffold ✅
- Estrutura de diretórios
- Arquivos vazios com tipos
- Configuração Next.js, Tailwind, TypeScript

### 1.2 — Modelo de Dados
- Schema Prisma com Folder, Document, Message
- Migrations e relações

### 1.3 — Ingestão de Documentos
- Upload (PDF, MD, TXT)
- Extração de texto
- Chunking (RecursiveCharacterTextSplitter: 1000 chars, overlap 200)
- Embeddings via text-embedding-3-small
- Inserção no ChromaDB com filtro `folder_id` obrigatório

### 1.4 — Chat RAG com Isolamento
- Query embedding
- Busca ChromaDB com filtro `folder_id` (CRÍTICO)
- Context assembly
- Stream com Claude
- Histórico em Prisma

### 1.5 — Classificação de Cliente
- LLM analisa dados da pasta
- Retorna: `template_id`, `eixo_razao_emocao`, `eixo_maturidade`, `justificativa`
- 9 templates disponíveis

### 1.6 — Gerador de Apresentação
- Busca todos chunks da pasta
- Executa classificador
- Carrega template selecionado
- Gera 10 slides em Markdown
- Marca dados faltantes com `[PREENCHER]`

### 1.7 — Interface Base
- Sidebar com lista de pastas
- Workspace com abas (Documentos, Chat, Entregáveis)
- Dark mode padrão
- Sem estilização elaborada (funcional e limpo)

**Critério de Aceite Fase 1:**
- ✅ Criar pasta de teste
- ✅ Upload 1 PDF + 1 MD
- ✅ Status "ready" em ambos
- ✅ Chat retorna respostas baseadas apenas nesses docs
- ✅ Gerar apresentação mostra template e 10 slides
- ✅ Log confirma filtro folder_id aplicado

---

## Fase 2 — Ingestão Multimodal

**Escopo:** Ampliar tipos de dados que o agente pode processar

### 2.1 — Transcrição de Áudio/Vídeo
- Upload local de arquivos
- Whisper (OpenAI) para transcrição
- Ingestão automática como chunks

### 2.2 — Links e Metadados
- YouTube / Instagram (yt-dlp)
- Extração de metadata e transcrições
- Enriquecimento de contexto

### 2.3 — Reuniões Gravadas
- Upload de gravações
- Transcrição automática
- Sumarização via Claude
- Ingestão estruturada

---

## Fase 3 — Módulos de Entregável Adicionais

**Escopo:** Expandir tipos de conteúdo gerado

### 3.1 — BrandKit / System Design
- Paleta de cores
- Tipografia
- Tokens de design
- Saída em Markdown

### 3.2 — Copy + Funil
- Textos para topo/meio/fundo de funil
- Por canal (email, social, landing)
- Tons personalizados

### 3.3 — Infográficos e Mapas
- Estrutura JSON para renderização
- Dados visualizáveis
- Templates de composição

### 3.4 — Posicionamento Estratégico
- Documento de diferenciação
- Arquitetura de marca
- Proposta de valor consolidada

---

## Fase 4 — Sistemas Relacionais

**Escopo:** Conectar pastas e criar histórico de relações

### 4.1 — CRM Leve
- Histórico de interações
- Evolução do cliente ao longo do tempo
- Timeline de projetos

### 4.2 — Briefing de Tráfego Pago
- Estrutura de campanhas
- Recomendações por perfil
- Budget allocation

### 4.3 — Community Management
- Planejamento pós-funil
- Engajamento comunitário
- Retenção e loyalty

---

## Restrições Absolutas (Todas as Fases)

1. **NUNCA busca vetorial sem filtro `folder_id`**
2. **NUNCA mistura contexto de pastas diferentes**
3. **Documentos com erro:** status = "error" + mensagem, sem quebrar fluxo
4. **Tudo roda local:** SQLite + ChromaDB (apenas APIs de LLM/embedding externas)
5. **Gerador NUNCA inventa dados:** usa `[PREENCHER]` quando não encontrar

---

## Stack Obrigatório (Mantém em todas as fases)

- **Frontend:** Next.js 15 (App Router), Tailwind CSS v4, dark mode
- **Backend:** API Routes Next.js
- **RAG:** LangChain.js
- **DB Relacional:** SQLite via Prisma
- **DB Vetorial:** ChromaDB local
- **LLM:** Claude API (claude-sonnet-4-20250514)
- **Embeddings:** text-embedding-3-small (OpenAI)

---

## Status Atual

**Fase:** 1.1 (Scaffold) — ✅ Completo
**Próximo:** 1.2 (Modelo de Dados)
