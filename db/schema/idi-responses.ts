/**
 * gabiOS — Schema: idi_responses
 * Respostas brutas do Protocolo IDI + outputs computados pelo IDI Squad.
 * 6 blocos: MBTI · Energia · 7 Camadas · Genialidade · Autossabotagem · Contexto
 */

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { clients } from "./clients";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const idiStatusEnum = pgEnum("idi_status", [
  "bruto",      // respostas coletadas, IDI Squad ainda não rodou
  "processado", // IDI Squad gerou Perfil + Manual + Prompt Master
  "finalizado", // revisado e validado pela Glenda
]);

export const idiFormatoEnum = pgEnum("idi_formato_input", [
  "texto_estruturado",
  "texto_livre",
  "anotacoes",
  "upload_print",
]);

// ─── Table ────────────────────────────────────────────────────────────────────

export const idiResponses = pgTable("idi_responses", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),

  aplicador: text("aplicador"),
  dataAplicacao: timestamp("data_aplicacao", { withTimezone: true }),
  formatoInput: idiFormatoEnum("formato_input"),

  // ── BLOCO 1 — MBTI ────────────────────────────────────────────────────────
  q1Ei: text("q1_ei"),      // "E" | "I" | "I_E_situacional"
  q2Sn: text("q2_sn"),      // "S" | "N" | "NS_equilibrado"
  q3Tf: text("q3_tf"),      // "T" | "F" | "equilibrado"
  q4Jp: text("q4_jp"),      // "J" | "P" | "situacional"
  mbtiTipo: text("mbti_tipo"),    // ex: "ENFJ"
  mbtiGrupo: text("mbti_grupo"),  // "Analista"|"Diplomata"|"Sentinela"|"Explorador"

  // ── BLOCO 2 — Mapa de Energia (1-5) ─────────────────────────────────────
  energiaFogo: integer("energia_fogo"),
  energiaTerra: integer("energia_terra"),
  energiaAgua: integer("energia_agua"),
  energiaAr: integer("energia_ar"),
  energiaMetal: integer("energia_metal"),
  energiaDominante: text("energia_dominante"),
  energiaPresente: text("energia_presente"),
  energiaAusente: text("energia_ausente"),

  // ── BLOCO 3 — 7 Camadas (Pablo Marçal) ──────────────────────────────────
  c1Projeto: text("c1_projeto"),
  c2Autoimagem: text("c2_autoimagem"),
  c3Autoconhecimento: text("c3_autoconhecimento"),
  c4Qi: text("c4_qi"),
  c5Qe: text("c5_qe"),
  c6Qs: text("c6_qs"),
  c7Plenitude: text("c7_plenitude"),
  camadaPredominante: text("camada_predominante"),
  tensaoCamadas: text("tensao_camadas"),

  // ── BLOCO 4 — Zona de Genialidade ────────────────────────────────────────
  q13Genialidade: text("q13_genialidade"),
  q14Mediocridade: text("q14_mediocridade"),
  q15Competencia: text("q15_competencia"),
  q16GenialidadeOculta: text("q16_genialidade_oculta"),

  // ── BLOCO 5 — Autossabotagem (Márcio Micheli) ────────────────────────────
  q17Ciclo: text("q17_ciclo"),
  q18BDominante: text("q18_b_dominante").array(),
  q19EventoInjustica: text("q19_evento_injustica").array(),

  // ── BLOCO 6 — Contexto ────────────────────────────────────────────────────
  q20Gatilho: text("q20_gatilho"),
  q21Prontidao: integer("q21_prontidao"), // 1–5
  q22VisaoSucesso: text("q22_visao_sucesso"),

  // ── Outputs computados pelo IDI Squad ────────────────────────────────────
  perfilIdentidadeMd: text("perfil_identidade_md"),
  manualRelacionamentoMd: text("manual_relacionamento_md"),
  promptMasterMd: text("prompt_master_md"),
  potencialNaoRealizado: text("potencial_nao_realizado"),
  arquetipoPrimario: text("arquetipo_primario"),
  arquetipoSecundario: text("arquetipo_secundario"),

  status: idiStatusEnum("status").notNull().default("bruto"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type IdiResponse = typeof idiResponses.$inferSelect;
export type NewIdiResponse = typeof idiResponses.$inferInsert;
