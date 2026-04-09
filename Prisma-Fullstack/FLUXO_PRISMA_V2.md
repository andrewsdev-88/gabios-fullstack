# FLUXO_PRISMA_V2.md
# Planta Baixa Oficial de Roteamento de Dados — gabiOS
# Versão: 2.0 · Arquiteto: Jimmy Andrews · Proprietária: G Gabi Produções

> Este documento é a fonte de verdade absoluta do roteamento de dados do ecossistema PRISMA.
> Qualquer refatoração de schema, API ou estrutura de pastas deve ser ancorada aqui.

---

## Visão Geral do Fluxo

O PRISMA opera em **4 Fases** e **6 Etapas**. Cada etapa tem inputs obrigatórios,
outputs verificados e gates de aprovação da Glenda. Nenhuma etapa avança sem
os inputs da anterior completamente persistidos no banco.

```
              ┌─────────────────────────────────────────────────────────┐
              │              G Gabi Produções · gabiOS                  │
              │         Sistema Operacional de Inteligência de Marca    │
              └─────────────────────────────────────────────────────────┘
                                         │
                              ┌──────────▼──────────┐
                              │   ETAPA 00          │
                              │   Captação de Lead  │
                              │   orq-etapa-00      │
                              └──────────┬──────────┘
                                         │
              ┌──────────────────────────▼──────────────────────────────┐
              │                  FASE 01 — Diagnóstico + Brand System   │
              │                                                         │
              │   ┌──────────────────────────────────────────────────┐  │
              │   │  ETAPA 01 — Diagnóstico de Identidade            │  │
              │   │  orq-etapa-01                                     │  │
              │   │  Mentes: identity-idi-squad + council-squad       │  │
              │   │  Output crítico: dossiê IDI + handoff Council     │  │
              │   │  DB: persiste em idi_responses + espelho_logs     │  │
              │   └─────────────────────┬────────────────────────────┘  │
              │                         │ [GATE: Dossiê completo]       │
              │   ┌─────────────────────▼────────────────────────────┐  │
              │   │  ETAPA 02 — Estratégia + Brand System            │  │
              │   │  orq-etapa-02                                     │  │
              │   │  Mentes: vertice + tendencias + copy-forense I/II │  │
              │   │          revealing + brand-strategist-visual      │  │
              │   │          skill-brand-architect + design-director  │  │
              │   │          apresenta-prisma                         │  │
              │   │  Output crítico: BDP aprovado (XML) + copys       │  │
              │   │  DB: persiste em brandkits + content_cycles       │  │
              │   │  GATE: Glenda valida o BDP — sem aprovação, nada  │  │
              │   │         avança para a Fase 02                     │  │
              │   └─────────────────────┬────────────────────────────┘  │
              └─────────────────────────┼────────────────────────────────┘
                                        │
              ┌─────────────────────────▼────────────────────────────────┐
              │                  FASE 02 — Studios                       │
              │                                                          │
              │   ┌────────────────────────────────────────────────────┐ │
              │   │  ETAPA 03 — Studios de Identidade Visual           │ │
              │   │  orq-etapa-03                                       │ │
              │   │  Mente: html-canvas-squad + html-canvas-tester     │ │
              │   │                                                     │ │
              │   │  PIPELINE DE STUDIOS (sequencial, não paralelo):   │ │
              │   │                                                     │ │
              │   │  Studio 0 (API Keys configuradas no localStorage)  │ │
              │   │     ↓ [PRÉ-REQUISITO ABSOLUTO]                     │ │
              │   │  Studio 1 (Logo System via Gemini)                 │ │
              │   │     ↓ GATE: logo aprovada pela Glenda              │ │
              │   │     ↓ Output obrigatório: logo_base64 → brandkits  │ │
              │   │  Studio 2 (Criativos Nano Banana 2)                │ │
              │   │     ↓ INPUT CRÍTICO: logo_base64 do Studio 1       │ │
              │   │     ↓ CONSTRAINT: logo_base64 NOT NULL na query    │ │
              │   │  Studio 3 (Templates Feed + Carrossel)             │ │
              │   │     ↓ INPUT CRÍTICO: logo_base64 + copy-forense    │ │
              │   │  Studio 4 (Capas de Redes Sociais)                 │ │
              │   │     ↓ OUTPUT FINAL: Relatório 02                   │ │
              │   │                                                     │ │
              │   │  DB: persiste studio_execucoes + content_assets    │ │
              │   └────────────────────────────────────────────────────┘ │
              └─────────────────────────┬────────────────────────────────┘
                                        │
              ┌─────────────────────────▼────────────────────────────────┐
              │                  FASE 03 — Produção de Conteúdo          │
              │                                                          │
              │   ┌────────────────────────────────────────────────────┐ │
              │   │  ETAPA 04 — Reels + Calendário de Stories          │ │
              │   │  orq-etapa-04                                       │ │
              │   │  Mente: roteirista-prisma + apresenta-prisma        │ │
              │   │  Inputs: roteiros-base copy-forense-ii              │ │
              │   │          20 roteiros da revelacao                   │ │
              │   │          handoff-estrategico do Vértice             │ │
              │   │          BDP aprovado (com logo_base64)             │ │
              │   │  Output: 4 ou 8 Reels + 20 stories + Relatório 03  │ │
              │   │  DB: persiste em content_assets (tipo=REEL/STORY)   │ │
              │   └────────────────────────────────────────────────────┘ │
              └─────────────────────────┬────────────────────────────────┘
                                        │
              ┌─────────────────────────▼────────────────────────────────┐
              │                  FASE 04 — Relatório Final + PDCA        │
              │                                                          │
              │   ┌────────────────────────────────────────────────────┐ │
              │   │  ETAPA 05 — Ciclo + Espelho PDCA                   │ │
              │   │  orq-etapa-05                                       │ │
              │   │  Mente: espelho-prisma + apresenta-prisma           │ │
              │   │  Output: Relatório Final + PDCA log + próximo ciclo │ │
              │   │  DB: persiste em espelho_logs (PLAN/DO/CHECK/ACT)   │ │
              │   │  Encaminha: orq-etapa-00 (próximo ciclo)           │ │
              │   └────────────────────────────────────────────────────┘ │
              └──────────────────────────────────────────────────────────┘
```

---

## Fase 01 — Diagnóstico + Brand System

### Etapa 00 — Captação de Lead

**Orquestradora:** `orq-etapa-00`

| Campo | Detalhe |
|---|---|
| Input | Primeiro contato do lead com a Glenda |
| Output | Perfil básico do lead + qualificação inicial |
| DB Table | `clients` → status: `etapa_00` |
| Gate | Lead confirma interesse → avança para Etapa 01 |

**Dados persistidos em `clients`:**
```
nome, email, telefone, instagram_handle, setor,
funil_etapa = 'etapa_00', plano_contratado, data_entrada
```

---

### Etapa 01 — Diagnóstico de Identidade

**Orquestradora:** `orq-etapa-01`
**Mentes:** `identity-idi-squad` · `council-squad`

| Campo | Detalhe |
|---|---|
| Input obrigatório | Respostas do formulário IDI (protocolo-idi-ggabi.html) |
| Input obrigatório | Observações da Glenda sobre o cliente |
| Input de contexto | Perfil do lead da Etapa 00 |
| Output | Dossiê IDI completo (versão cliente + versão PRISMA) |
| Output | Relato do Council Squad + handoff estruturado para o Vértice |
| DB Tables | `idi_responses` · `clients` (update funil para `etapa_01`) |
| Gate | Council Squad completo → handoff entregue ao Vértice |

**Dados persistidos em `idi_responses`:**

*Bloco 1 — MBTI e Cognição:*
```
mbti_tipo, mbti_confirmado, funcao_dominante,
funcao_auxiliar, funcao_terciaria
```

*Bloco 2 — Energia:*
```
tipo_energia, ritmo_trabalho, horario_pico,
contexto_social_preferido
```

*Bloco 3 — 7 Camadas de Identidade:*
```
camada_ser, camada_fazer, camada_ter,
camada_conhecer, camada_expressar,
camada_conectar, camada_legado
```

*Bloco 4 — Genialidade:*
```
genialidade_primaria, genialidade_secundaria,
zona_frustracao, zona_competencia
```

*Bloco 5 — Autossabotagem:*
```
padrao_autossabotagem, gatilho_principal,
estrategia_compensacao
```

*Bloco 6 — Contexto Operacional:*
```
nicho_mercado, proposta_valor, cliente_ideal,
dor_principal, diferencial
```

*Outputs processados pelo IDI Squad:*
```
perfil_idi_cliente_md (TEXT),     -- versão para o cliente
perfil_idi_prisma_md (TEXT),      -- versão interna com alertas
manual_operacional_md (TEXT),     -- como trabalhar com esse perfil
prompt_master (TEXT),             -- prompt base para todos os agentes
handoff_council_md (TEXT)         -- dossiê completo para o Vértice
```

**Regras críticas:**
- Nunca processar IDI sem as observações da Glenda.
- Nunca avançar sem o Council Squad completo.
- O Cético nunca aparece para o cliente — seus alertas viram pontos de atenção internos.
- `handoff_council_md` é o input mandatório da Etapa 02.

---

### Etapa 02 — Estratégia + Brand System

**Orquestradora:** `orq-etapa-02`
**Mentes:** `vertice` · `tendencias-plataforma` · `copy-forense-i` · `copy-forense-ii`
           `revelacao` · `brand-strategist-visual` · `skill-brand-architect`
           `design-director` · `apresenta-prisma`

| Campo | Detalhe |
|---|---|
| Input obrigatório | `handoff_council_md` da Etapa 01 |
| Input obrigatório | Dossiê completo do Council Squad |
| Output | BDP aprovado em XML (paleta, tipografia, constraints, logo direction) |
| Output | Copy Forense I (criativos) + Copy Forense II (reels) |
| Output | Revelação: 9 primeiros posts + 20 roteiros de stories |
| Output | PITCH_COMERCIAL + Relatório 01 (Versão Cliente) |
| DB Tables | `brandkits` · `content_cycles` · `clients` (update `etapa_02`) |
| **GATE HARD** | Glenda valida o BDP → `brandkits.glenda_aprovado = TRUE` |
| Bloqueio real | Studio 1 NÃO pode iniciar se `brandkits.glenda_aprovado` for FALSE |

**Dados persistidos em `brandkits`:**

*Arquitetura Cromática:*
```
cor_background, cor_primaria, cor_secundaria, cor_terciaria,
cor_corpo, cor_muted, cor_nome_background, cor_nome_primaria,
cor_nome_secundaria, cor_nome_terciaria, cor_nome_corpo,
cor_nome_muted, cores_suporte JSONB
```

*Tipografia:*
```
font_display, font_display_uso, font_corpo,
font_corpo_peso, font_corpo_uso, font_destaque, font_destaque_uso
```

*Restrições e Logo:*
```
restrictions TEXT,             -- o que a marca rejeita
logo_direction TEXT,           -- brief técnico para o Studio 1
glenda_aprovado BOOLEAN,       -- GATE HARD
bdp_xml TEXT,                  -- BDP completo em XML
logo_base64 TEXT               -- NULO até Studio 1 concluir
```

*Nota:* `logo_base64` é NULL aqui no fim da Etapa 02. Só o Studio 1 preenche.

---

## Fase 02 — Studios

### Etapa 03 — Studios de Identidade Visual

**Orquestradora:** `orq-etapa-03`
**Mente:** `html-canvas-squad` · `html-canvas-tester`

#### O Pipeline dos Studios:

```
[Studio 0 — API Keys]
        ↓ PRÉ-REQUISITO (sem chaves, tudo bloqueia)
[Studio 1 — Logo System]
        ↓ GATE: logo aprovada pela Glenda
        ↓ WRITE: brandkits.logo_base64 (campo crítico)
[Studio 2 — Criativos Nano Banana 2]
        ↓ READ CHECK: brandkits.logo_base64 NOT NULL (CONSTRAINT)
        ↓ Se logo_base64 for NULL → BLOQUEAR execução com erro
[Studio 3 — Templates Feed + Carrossel]
        ↓ READ CHECK: brandkits.logo_base64 NOT NULL
[Studio 4 — Capas de Redes Sociais]
        ↓ Relatório 02
```

**Lógica de bloqueio — campo crítico `logo_base64`:**

```sql
-- Verificação antes de qualquer Studio 2, 3 ou 4 iniciar:
SELECT logo_base64
FROM brandkits
WHERE client_id = :client_id
  AND glenda_aprovado = TRUE;

-- Se retornar NULL → status = BLOCKED, mensagem de erro.
-- Só prossegue com logo_base64 NOT NULL.
```

**Dados persistidos em `studio_execucoes` (nova tabela):**
```
id UUID PK
client_id UUID FK → clients
brandkit_id UUID FK → brandkits
studio_numero SMALLINT (0, 1, 2, 3, 4)
status ENUM ('PENDING','RUNNING','APPROVED','BLOCKED','FAILED')
output_url TEXT           -- URL ou base64 do artefato gerado
glenda_aprovado BOOLEAN
aprovado_em TIMESTAMP
observacoes TEXT          -- campo de alterações pontuais
created_at TIMESTAMP
updated_at TIMESTAMP
```

**Constraint de banco:**
```sql
-- Gatilho que bloqueia Studio 2+ se logo não aprovada
CREATE OR REPLACE FUNCTION check_logo_before_studio()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.studio_numero >= 2 THEN
    PERFORM 1 FROM brandkits
    WHERE id = NEW.brandkit_id
      AND logo_base64 IS NOT NULL
      AND glenda_aprovado = TRUE;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Studio % bloqueado: logo_base64 não aprovada no Studio 1.',
        NEW.studio_numero;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_studio_logo_gate
BEFORE INSERT ON studio_execucoes
FOR EACH ROW EXECUTE FUNCTION check_logo_before_studio();
```

**Dados persistidos em `content_assets` (assets visuais):**
```
client_id, brandkit_id, content_cycle_id
tipo ENUM ('CRIATIVO_FEED','CARROSSEL','CAPA_DESTAQUE','CAPA_REDE',
           'MOCKUP','BRAND_BOARD','FOTO_PERFIL','THUMBNAIL')
studio_origem SMALLINT (0-4)
titulo, roteiro_md, script_gemini_prompt
status ENUM ('aguardando_briefing','em_producao','aguardando_aprovacao',
             'aprovado','publicado','pausado','cancelado')
arquivo_url, aprovado_por, aprovado_em
deadline_aprovacao TIMESTAMP
metricas JSONB
```

---

## Fase 03 — Produção de Conteúdo

### Etapa 04 — Reels + Calendário de Stories

**Orquestradora:** `orq-etapa-04`
**Mente:** `roteirista-prisma` · `apresenta-prisma`

| Campo | Detalhe |
|---|---|
| Input obrigatório | Roteiros base da `copy-forense-ii` (da Etapa 02) |
| Input obrigatório | 20 roteiros base da `revelacao` (da Etapa 02) |
| Input obrigatório | Handoff Estratégico do Vértice (da Etapa 02) |
| Input obrigatório | BDP aprovado com `logo_base64` (da Etapa 03 Studio 1) |
| Output | 4 ou 8 Reels (roteiros cinematográficos completos) |
| Output | 20 roteiros de stories (calendário mensal) |
| Output | Relatório 03 |
| DB Tables | `content_assets` (tipo=REEL/STORY) · `content_cycles` |

**Dados persistidos em `content_cycles`:**
```
client_id, brandkit_id, mes_referencia DATE
reels_contratados SMALLINT (4 ou 8, conforme plano)
stories_contratados SMALLINT (sempre 20)
status ENUM ('planejamento','em_producao','entregue','aprovado')
handoff_estrategico_md TEXT   -- snapshot do Vértice
copy_forense_i_md TEXT        -- snapshot copy-forense-i
copy_forense_ii_md TEXT       -- snapshot copy-forense-ii
roteiros_base_revelacao TEXT  -- snapshot revelacao
```

**Restrições do roteirista-prisma:**
- Número de Reels segue o plano contratado — nunca improvisa.
- Glenda é Diretora de Corte — aprova e rejeita, nunca edita manualmente.
- Os 20 stories são obrigatórios — não opcionais.

---

## Fase 04 — Relatório Final + PDCA

### Etapa 05 — Ciclo + Espelho PDCA

**Orquestradora:** `orq-etapa-05`
**Mente:** `espelho-prisma` · `apresenta-prisma`

| Campo | Detalhe |
|---|---|
| Input | Todos os artefatos do ciclo (Etapas 01-04) |
| Output | Relatório Final + log PDCA completo |
| Output | Diagnóstico de ajuste + plano do próximo ciclo |
| DB Table | `espelho_logs` |
| Loop | Encaminha para `orq-etapa-00` (próximo ciclo) |

**Dados persistidos em `espelho_logs`:**
```
client_id, content_cycle_id, fase ENUM ('PLANO','EXECUCAO','ANALISE','AJUSTE')
o_que_foi_planejado TEXT
o_que_foi_executado TEXT
desvios_encontrados TEXT
metricas_reais JSONB          -- números reais de performance
diagnostico TEXT              -- análise do espelho-prisma
ajustes_proxima_fase JSONB    -- ajustes de skills, prompts, estratégia
aprovado_por, aprovado_em
```

---

## Tabela de Gates Obrigatórios

| Gate | Etapa | Condição de Bloqueio | DB Constraint |
|---|---|---|---|
| IDI incompleto | 00→01 | IDI não respondido | `idi_responses` sem registro |
| Council incompleto | 01→02 | `handoff_council_md` NULL | Campo obrigatório NOT NULL |
| BDP não aprovado | 02→03 | `brandkits.glenda_aprovado = FALSE` | CHECK constraint |
| Logo não gravada | Studio 1→2 | `logo_base64 IS NULL` | Trigger `trg_studio_logo_gate` |
| Studio 1 incompleto | Studio 2+ | `studio_execucoes.status != 'APPROVED'` | FK + trigger |
| Canvas não validado | 03→04 | `html-canvas-tester` não executado | Status 'BLOCKED' |
| Reels insuficientes | 04→05 | Qtd reels < plano contratado | COUNT check |

---

## Planos e Etapas Ativas

| Plano | Valor | Etapas Ativas |
|---|---|---|
| Plano 1 · Ativação | R$ 850 | 00 → 01 → 05 |
| Plano 2 · PRISMA + Ativação | R$ 1.200 | 00 → 01 → 02 → 03 → 05 |
| Plano 3 · PRISMA + 4 Reels | R$ 1.800 | 00 → 01 → 02 → 03 → 04(4) → 05 |
| Plano 4 · PRISMA + 8 Reels | R$ 2.400 | 00 → 01 → 02 → 03 → 04(8) → 05 |
| Mensal 1 | R$ 650/mês | 03 → 05 |
| Mensal 2 | R$ 1.200/mês | 03 → 04(4) → 05 |
| Mensal 3 | R$ 1.800/mês | 03 → 04(8) → 05 |

---

## Restrições Absolutas do Sistema

1. Nunca pular etapas. Cada etapa alimenta a próxima com dados reais persistidos.
2. Studio 0 é pré-requisito absoluto de todos. Sem API keys, nada executa.
3. Studio 1 (logo_base64) é pré-requisito de Studio 2, 3 e 4. Banco enforce via trigger.
4. BDP aprovado pela Glenda (`glenda_aprovado = TRUE`) antes de qualquer Studio iniciar.
5. `html-canvas-tester` obrigatório após cada Studio. Status 'BLOCKED' bloqueia avanço.
6. `espelho_logs` é obrigatório em todo ciclo — independente do plano contratado.
7. Nunca inventar dados do cliente. Tudo parte dos outputs persistidos das etapas anteriores.
8. Busca RAG sempre com filtro `client_id`. Nunca mistura contexto entre clientes.
