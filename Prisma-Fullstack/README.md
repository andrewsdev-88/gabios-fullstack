# PRISMA Fullstack — G Gabi Produções
**Sistema de Branding e Produção de Conteúdo**
*Arquiteto: Jimmy Andrews · Cliente: Glenda Gabi · @ggabiproducoes · Campo Grande, MS*
*Última atualização: Abril 2026*

---

## ⚠️ REGRAS CRÍTICAS — LER ANTES DE QUALQUER AÇÃO

### Papéis
```
ARQUITETO: Jimmy Andrews
→ Constrói, configura e evolui o ecossistema
→ Nunca é usuário final das skills
→ Opera como desenvolvedor, não como cliente

USUÁRIO FINAL DE TODAS AS SKILLS: Glenda (G Gabi Produções)
→ "Você" dentro de qualquer skill = Glenda
→ Interlocutora de todas as entregas ao cliente final
```

### Execução
```
1. Diagnóstico ou proposta
2. Aguardar aprovação explícita do Jimmy
3. Executar
Nunca entregar sem aprovação. Regra inegociável.
```

### Nomeação
```
Todo arquivo usa o nome da skill ou componente.
Nunca nomes genéricos como SKILL.md ou output.html.
```

### GitHub / Firebase
```
AGENDADO — discutir na próxima sessão:
→ GitHub para versionamento das skills e arquivos do ecossistema
→ Firebase como backend para dados de clientes (fase de plataforma)
→ MCP Firebase — somente após o método estar estável e a plataforma definida
```

---

## Visão do Projeto

O PRISMA é um método completo de presença digital para criadores e profissionais liberais.
Vai do diagnóstico de identidade até a produção de conteúdo — em ciclos renováveis mensais.
É um produto da G Gabi Produções. O ponto de entrada único é o `prisma-fullstack`.

---

## Arquitetura do Ecossistema

```
prisma-fullstack (ponto de entrada — apresenta e delega, nunca executa)
          ↓
ETAPA 00 — Captação
orq-etapa-00
          ↓
FASE 01 — Diagnóstico + Brand System
  ETAPA 01 — Diagnóstico
  orq-etapa-01
  identity-idi-squad + council-squad
          ↓
  ETAPA 02 — Estratégia + Brand System
  orq-etapa-02
  vertice + tendencias-plataforma
  copy-forense-i + copy-forense-ii + revelacao
  brand-strategist-visual → Gate (Glenda valida BDP)
  skill-brand-architect + design-director
  apresenta-prisma (PITCH_COMERCIAL + Relatório 01)
          ↓
FASE 02 — Studios
  ETAPA 03 — Studios
  orq-etapa-03
  Studio 0 (API keys) → Studio 1 (Logo) → Studio 2 (ID Visual)
  → Studio 3 (Templates) → Studio 4 (Capas de Redes)
  html-canvas-squad + html-canvas-tester
  apresenta-prisma (Relatório 02)
          ↓
FASE 03 — Produção de Reels + Calendário
  ETAPA 04 — Reels + Stories
  orq-etapa-04
  roteirista-prisma (Reels + 20 vídeos de stories)
  apresenta-prisma (Relatório 03)
          ↓
FASE 04 — Relatório Final
  ETAPA 05 — Ciclo e Melhoria
  orq-etapa-05
  espelho-prisma + apresenta-prisma (Relatório 04)
          ↓
  próximo ciclo → orq-etapa-00
```

---

## Separação Etapa × Fase

| Etapa | Fase do cliente | O que acontece |
|-------|----------------|----------------|
| Etapa 00 | Pré-entrada | Captação e qualificação do lead |
| Etapas 01 + 02 | Fase 01 | Diagnóstico + Brand System completo |
| Etapa 03 | Fase 02 | Studios de identidade visual |
| Etapa 04 | Fase 03 | Reels + Calendário de stories |
| Etapa 05 | Fase 04 | Relatório Final + Espelho |

---

## Inventário Completo de Skills

### Ponto de entrada
| Skill | Função | Status |
|-------|--------|--------|
| `prisma-fullstack` | Meta-orquestradora. Apresenta e delega. | ✅ Novo |

### Orquestradoras de Etapa
| Skill | Etapa | Função | Status |
|-------|-------|--------|--------|
| `orq-etapa-00` | Captação | Qualifica lead, proposta comercial | ✅ Atualizada |
| `orq-etapa-01` | Diagnóstico | IDI Squad + Council Squad + dossiê | ✅ Atualizada |
| `orq-etapa-02` | Estratégia + Brand | Vértice completo + BDP + relatórios | ✅ Nova arquitetura |
| `orq-etapa-03` | Studios | Studio 0 a 4 + Relatório 02 | ✅ Atualizada |
| `orq-etapa-04` | Reels + Stories | Roteirista + 20 stories + Relatório 03 | ✅ Atualizada |
| `orq-etapa-05` | Ciclo e Melhoria | Métricas + Espelho + Relatório 04 | ✅ Atualizada |

### Mentes Especializadas
| Skill | Etapa | Função | Status |
|-------|-------|--------|--------|
| `identity-idi-squad` | 01 | Processa IDI. Versão Cliente + Versão PRISMA. | ✅ Bloco voz injetado |
| `council-squad` | 01 | Mesa estratégica + O Cético dinâmico + dossiê | ✅ Bloco voz injetado |
| `vertice` | 02 | Bozoma + Ann + Melanie. Calendário 20 stories obrigatório. | ✅ Bloco voz injetado |
| `tendencias-plataforma` | 02 | Pesquisa em tempo real por plataforma | ✅ Bloco voz injetado |
| `copy-forense-i` | 02 | Copy de criativos, BIO, destaques, capas | ✅ Bloco voz injetado |
| `copy-forense-ii` | 02 | Roteiros de Reels + calendário editorial | ✅ Bloco voz injetado |
| `revelacao` | 02 | 9 primeiros posts + 20 roteiros de stories | ✅ Bloco voz injetado |
| `brand-strategist-visual` | 02 | BDP primário com chain of thought obrigatório | ✅ Bloco voz injetado |
| `skill-brand-architect` | 02 | Símbolo e wordmark dentro do BDP | ✅ Bloco voz injetado |
| `design-director` | 02 | 4 rotinas: Key Visual, Design System, Briefs, QA | ✅ Bloco voz injetado |
| `roteirista-prisma` | 04 | Direção cinematográfica dos Reels e 20 stories | ✅ Bloco voz injetado |
| `espelho-prisma` | 05 | PDCA do sistema. Retroalimenta o ecossistema. | ✅ Bloco voz injetado |
| `apresenta-prisma` | Todas | PITCH + 4 Relatórios. Roteador Condicional. | ✅ Bloco voz injetado |
| `html-canvas-squad` | 03 | Construção técnica dos Studios com Gemini API | ✅ Ativa |
| `html-canvas-tester` | 03 | Validação técnica obrigatória após cada Studio | ✅ Ativa |

### Skills Independentes
| Skill | Função |
|-------|--------|
| `council-jimmy` | Mesa de conselheiros do Jimmy — uso do Arquiteto |
| `sistemas-ia` | Diagnóstico operacional — outros projetos |
| `briefcheck` | Validação de briefs avulsos |
| `skill-creator` | Criação e manutenção de skills |

---

## Decisões Arquiteturais — Abril 2026

### 1. prisma-fullstack substitui prisma-orquestrador
Nome definitivo do sistema. Ponto de entrada único para a Glenda.
A Glenda nunca precisa saber o nome de uma orquestradora ou mente.

### 2. Separação Etapa × Fase
Etapas = estrutura interna do sistema (orquestradoras).
Fases = o que o cliente vive e recebe. São conceitos distintos e não intercambiáveis.

### 3. brand-strategist-visual e design-director entram na Etapa 02
Movidos da Etapa 03 para a Etapa 02. O Relatório 01 já sai com o Brand System completo.
A Etapa 03 passa a ser exclusivamente execução nos Studios.

### 4. Calendário dos 20 stories é output obrigatório do Vértice
Não é opcional. O Vértice entrega a estratégia do calendário mensal de stories
junto com o Handoff Estratégico.

### 5. Bloco de voz em todas as skills
Todas as 13 mentes + 6 orquestradoras + prisma-fullstack receberam:
`<system_role>` + `<voice_and_tone>` + `<forbidden_patterns>` + `<quality_gate>`

### 6. Studios como plataforma — pendente Claude Code
Os Studios serão reunidos em um único HTML com navegação entre eles,
BDP e API keys compartilhados via localStorage.
Arquitetura a definir com Claude Code em sessão separada.

---

## Padrão de Voz — Todas as Skills

```xml
<system_role>
Perspectiva visionária, estratégica e implacável.
Inteligência ancorada em dados reais. Sem hesitar, sem pedir desculpas.
</system_role>

<voice_and_tone>
Português do Brasil. Presença e ritmo natural.
Direto, vivo, claro. Estrategista sênior pragmático.
</voice_and_tone>

<forbidden_patterns>
1. Travessões (em nenhuma hipótese)
2. Versismo ou floreios vazios
3. Tom corporativo, professoral ou bajulador
4. Palavras infladas: "desvendar", "mergulhar", "jornada", "em resumo"
5. Suavização de críticas estratégicas
</forbidden_patterns>

<quality_gate>
<silent_review> obrigatório antes de qualquer output.
Se soar como IA: destruir e reescrever.
</quality_gate>
```

---

## Design System por Relatório

| Documento | Design System |
|-----------|--------------|
| PITCH_COMERCIAL | G Gabi Produções |
| Relatório 01 | G Gabi Produções |
| Relatório 02 | BDP do cliente |
| Relatório 03 | BDP do cliente |
| Relatório 04 | BDP do cliente (G Gabi só no rodapé) |

---

## Planos Comerciais

| Plano | Valor | Etapas |
|-------|-------|--------|
| Plano 1 — Ativação | R$850 | 00→01→05 |
| Plano 2 — PRISMA + Ativação | R$1.200 | 00→01→02→03→05 |
| Plano 3 — PRISMA + 4 Reels | R$1.800 | 00→01→02→03→04(4)→05 |
| Plano 4 — PRISMA + 8 Reels | R$2.400 | 00→01→02→03→04(8)→05 |
| Mensal 1 | R$650/mês | 03→05 |
| Mensal 2 | R$1.200/mês | 03→04(4)→05 |
| Mensal 3 | R$1.800/mês | 03→04(8)→05 |

---

## Clientes em Processamento

### Cliente 01 — Glenda Gabi · G Gabi Produções
IDI não preenchido. Pipeline como cliente não iniciado.

| Componente | Status |
|---|---|
| Studio 0 — Design Director | ✅ Selado |
| Studio 1 — Logo System | ✅ Aprovado (22/03/2026) |
| Studio 2 — Criativos | ✅ Gate QA aprovado |
| Studio 3 Canvas 1 — carousel-fixados.html | ✅ Selado v4 |
| Studio 3 Canvas 2 — post-ggabi.html | 🔄 Zona de segurança pendente |
| Studio 3 Canvas 3 — carousel-livre.html | ⏳ Não iniciado |
| Studio 4 — Capas de redes | ⏳ Não iniciado |
| protocolo-idi-ggabi.html | ✅ Selado + localStorage implementado |

### Cliente 02 — Jimmy Andrews · Jimmy Andrews Fullstack IA
```
✅ IDI Squad → 7 alertas
✅ Council Squad → 6 fechados · 1 aberto (caso narrado — ALERTA 03)
✅ Vértice → Handoff completo
✅ BDP v1.1 aprovado
✅ Design Director → 4 briefs + QA
✅ Logo V1 "O Fragmento" aprovado e integrado
⏳ Canvas → 4 pendentes (Post Feed · Stories · LinkedIn · YouTube)
⏳ Relatório 02 → aguarda Canvas
⏳ Etapa 04 → pendente
⏳ Etapa 05 → pendente
```
PRÉ-REQUISITO: caso narrado não formalizado bloqueia Post 06, Reel 07 e CTAs de compra.

Sistema Visual:
```
#D4860A Âmbar · #F2EDE4 Off-White · #F0A830 Âmbar Claro
#8A5500 Âmbar Escuro · #0D0D0B Preto · #3D3D3A Muted
Display: Barlow Condensed 800–900 (Bebas Neue vetada)
Logo: V1 "O Fragmento"
```

### Cliente 03 — Joaquim Soares · Oliveira Neto Advogados Associados
```
✅ IDI Squad → 5 alertas
✅ Council Squad → deliberado + O Cético (ISTJ)
✅ Vértice → 3 execuções (final com 5 constraints Melanie)
✅ BDP v1.1 aprovado
✅ Design Director → 4 briefs + QA (7 testes)
✅ Logo V1 "O Encontro" aprovado e integrado
✅ Relatório 01 v2 gerado
⏳ Canvas → 4 pendentes (Post Feed · Stories · LinkedIn · YouTube)
⏳ PITCH_COMERCIAL → pendente
⏳ Relatório 02 → aguarda Canvas
⏳ Etapa 04 → pendente
⏳ Etapa 05 → pendente
```

Sistema Visual:
```
#2D5016 Verde Floresta · #C4622D Terracota · #7BAF5A Verde Claro
#F0E6D3 Creme · #0F0E0C Preto Orgânico · #5C5C52 Muted
Display: Raleway 700–800 Title Case (não ALL CAPS)
Logo: V1 "O Encontro"
```

---

## Design System G Gabi Produções (BDP v2.3)

```
#0A0A08 Preto Quente · #C8F23A Lime · #FF4D8F Rosa
#FF7C35 Laranja · #F5F2EB Off-white · #5a5650 Muted
Bebas Neue display · Poppins Light 300 · Lora Italic
Editorial escuro · noise texture 3–4%
Logo base64: embutida em apresenta-prisma (133.232 chars)
```

---

## Próximos Passos — Em Ordem de Prioridade

1. **Canvas Joaquim** — html-canvas-squad (4 briefs prontos)
2. **PITCH_COMERCIAL Joaquim** — apresenta-prisma modo PITCH
3. **Relatório 02 Joaquim** — após Canvas, BDP do Joaquim aplicado
4. **Canvas 2 G Gabi** — post-ggabi.html zona de segurança
5. **Canvas 3 G Gabi** — carousel-livre.html
6. **Studio 4 G Gabi** — Capas de redes
7. **IDI da Glenda** — formulário não preenchido
8. **Etapa 01 Glenda como cliente** — IDI + Council
9. **Canvas Jimmy** — 4 Canvas (briefs prontos)
10. **Formalizar caso narrado** — ALERTA 03 Jimmy (Glenda conduz)
11. **Etapa 04 Joaquim** — roteirista + 20 stories
12. **Etapa 04 Jimmy** — após Canvas
13. **Etapas 03 e 04 Glenda** — Studios + Reels
14. **Plataforma Studios** — Claude Code (sessão separada)
15. **GitHub** — versionamento do ecossistema (agendar)

---

## Histórico de Sessões

### Sessão — 08 Abril 2026
- `prisma-fullstack` criado (substitui prisma-orquestrador)
- Orquestradoras orq-etapa-00 a 05 reescritas com nova arquitetura
- Separação definitiva Etapa × Fase documentada
- brand-strategist-visual e design-director movidos para Etapa 02
- Calendário dos 20 stories declarado output obrigatório do Vértice
- Bloco `<system_role>` + voz + forbidden + quality_gate injetado em 13 skills
- `protocolo-idi-ggabi.html` recebeu persistência via localStorage
- Studios como plataforma agendados para Claude Code
- GitHub/Firebase agendados para próxima sessão de arquitetura

### Sessões anteriores — Março/Abril 2026
- Studio 1 G Gabi aprovado (22/03/2026)
- Canvas 1 selado (carousel-fixados v4)
- Formulário IDI construído e selado
- BDP G Gabi v2.3 ativo com logo base64
- Pipeline Jimmy Andrews completo até Canvas
- Pipeline Joaquim completo até Canvas
- Skills do Módulo Estratégico criadas
- Reestruturação em squads e orquestradoras por etapa
