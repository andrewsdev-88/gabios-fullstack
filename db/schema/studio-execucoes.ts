/**
 * gabiOS — Schema: studio_execucoes
 * Controla o fluxo sequencial dos 5 Studios na Etapa 03.
 *
 * REGRAS DE NEGÓCIO HARD (enforced por trigger no banco):
 *   Studio 0  → pré-requisito de todos (API keys)
 *   Studio 1  → pré-requisito de 2, 3 e 4 (logo_base64)
 *   Studio 2+ → bloqueado se brandkits.logo_base64 IS NULL
 *   Studio 2+ → bloqueado se brandkits.glenda_aprovado = FALSE
 *
 * O trigger SQL `trg_studio_logo_gate` implementa esse bloqueio
 * no nível do banco. A camada de aplicação deve verificar antes
 * de inserir, mas o banco é a última linha de defesa.
 */

import {
  pgTable,
  pgEnum,
  uuid,
  smallint,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { clients } from "./clients";
import { brandkits } from "./brandkits";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const studioNumeroEnum = pgEnum("studio_numero_enum", [
  "0", // Studio 0 — API Keys (pré-requisito absoluto)
  "1", // Studio 1 — Logo System (pré-requisito de 2, 3, 4)
  "2", // Studio 2 — Criativos Nano Banana 2
  "3", // Studio 3 — Templates Feed + Carrossel
  "4", // Studio 4 — Capas de Redes Sociais
]);

export const studioStatusEnum = pgEnum("studio_status", [
  "pending",   // aguardando início
  "running",   // em execução (Gemini processando, Glenda revisando)
  "approved",  // Glenda aprovou — html-canvas-tester passou
  "blocked",   // BLOQUEADO: dependência não satisfeita (logo, gate)
  "failed",    // falha técnica (API error, timeout)
  "skipped",   // pulado por acordo da Glenda (raro)
]);

// ─── Table ────────────────────────────────────────────────────────────────────

export const studioExecucoes = pgTable("studio_execucoes", {
  id: uuid("id").primaryKey().defaultRandom(),

  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),

  brandkitId: uuid("brandkit_id")
    .notNull()
    .references(() => brandkits.id, { onDelete: "cascade" }),

  // ── Identificação do Studio ───────────────────────────────────────────────
  studioNumero: smallint("studio_numero").notNull(), // 0|1|2|3|4
  studioNome: text("studio_nome").notNull(),         // human-readable
  // Exemplos: "Studio 0 — API Keys"
  //           "Studio 1 — Logo System"
  //           "Studio 2 — Criativos Nano Banana 2"
  //           "Studio 3 — Templates Feed + Carrossel"
  //           "Studio 4 — Capas de Redes Sociais"

  status: studioStatusEnum("status").notNull().default("pending"),

  // ── Outputs principais ────────────────────────────────────────────────────
  outputUrl: text("output_url"),          // URL do artefato gerado (S3, Drive, etc.)
  outputBase64: text("output_base64"),    // base64 do output (logos, PNGs finais)
  outputMd: text("output_md"),            // markdown / relatório de saída

  // ── Bloqueio — motivo se status = 'blocked' ───────────────────────────────
  bloqueioMotivo: text("bloqueio_motivo"),
  // Exemplos:
  //   "Studio 1 não concluído: logo_base64 não gravado em brandkits."
  //   "BDP não aprovado pela Glenda: glenda_aprovado = FALSE."

  // ── Validação (html-canvas-tester) ───────────────────────────────────────
  canvasTesterPassou: boolean("canvas_tester_passou"),
  canvasTesterLog: text("canvas_tester_log"),   // detalhes do QA

  // ── Aprovação da Glenda ───────────────────────────────────────────────────
  glendaAprovado: boolean("glenda_aprovado").notNull().default(false),
  glendaAprovadoEm: timestamp("glenda_aprovado_em", { withTimezone: true }),
  glendaObservacoes: text("glenda_observacoes"), // campo de alterações pontuais

  // ── Histórico de revisões ─────────────────────────────────────────────────
  tentativas: smallint("tentativas").notNull().default(0),
  iniciadoEm: timestamp("iniciado_em", { withTimezone: true }),
  concluidoEm: timestamp("concluido_em", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type StudioExecucao = typeof studioExecucoes.$inferSelect;
export type NewStudioExecucao = typeof studioExecucoes.$inferInsert;

// ─── SQL do Trigger de Bloqueio (documentado aqui, aplicado via migração) ────
//
// Execute esta SQL no Supabase SQL Editor após rodar as migrations:
//
// CREATE OR REPLACE FUNCTION check_logo_before_studio()
// RETURNS TRIGGER AS $$
// BEGIN
//   -- Studios 2, 3, 4 exigem logo_base64 aprovada no Studio 1
//   IF NEW.studio_numero >= 2 THEN
//     PERFORM 1 FROM brandkits
//     WHERE id = NEW.brandkit_id
//       AND logo_base64 IS NOT NULL
//       AND glenda_aprovado = TRUE;
//     IF NOT FOUND THEN
//       RAISE EXCEPTION
//         'Studio % BLOQUEADO: logo_base64 não aprovada no Studio 1. '
//         'Execute o Studio 1 e obtenha aprovação da Glenda antes de continuar.',
//         NEW.studio_numero;
//     END IF;
//   END IF;
//   -- Qualquer Studio exige BDP aprovado
//   IF NEW.studio_numero >= 1 THEN
//     PERFORM 1 FROM brandkits
//     WHERE id = NEW.brandkit_id AND glenda_aprovado = TRUE;
//     IF NOT FOUND THEN
//       RAISE EXCEPTION
//         'Studio % BLOQUEADO: BDP não aprovado pela Glenda (glenda_aprovado = FALSE).',
//         NEW.studio_numero;
//     END IF;
//   END IF;
//   RETURN NEW;
// END;
// $$ LANGUAGE plpgsql;
//
// CREATE TRIGGER trg_studio_logo_gate
// BEFORE INSERT ON studio_execucoes
// FOR EACH ROW EXECUTE FUNCTION check_logo_before_studio();
