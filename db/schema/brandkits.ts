/**
 * gabiOS — Schema: brandkits
 * BDP aprovado no GATE da Etapa 02 (brand-strategist-visual → Glenda).
 * Estrutura espelha o <BDP_Document> XML gerado pelo brand-strategist-visual.
 *
 * CAMPOS CRÍTICOS PARA A LINHA DE MONTAGEM DOS STUDIOS:
 *   - glenda_aprovado: GATE HARD — Studio 1 não inicia sem TRUE
 *   - logo_base64:    GATE HARD — Studios 2, 3 e 4 não iniciam sem este campo
 *     → Preenchido exclusivamente pelo Studio 1 após aprovação da Glenda
 *     → NULL até Studio 1 concluir
 */

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  date,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { clients } from "./clients";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const brandkitStatusEnum = pgEnum("brandkit_status", [
  "aguardando_validacao", // saiu do brand-strategist-visual, aguarda Gate da Glenda
  "aprovado",             // Glenda aprovou — Studios podem consumir
  "revisao",              // Glenda pediu ajustes
  "logo_gravada",         // Studio 1 concluiu — logo_base64 preenchido
  "arquivado",            // versão antiga, substituída por nova
]);

// ─── Tipos auxiliares (para JSONB) ────────────────────────────────────────────

export type CorSuporte = {
  nome: string;
  hex: string;
  uso: string;
  defesa: string;
};

// ─── Table ────────────────────────────────────────────────────────────────────

export const brandkits = pgTable("brandkits", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),

  versao: text("versao").notNull().default("1.0"),
  status: brandkitStatusEnum("status").notNull().default("aguardando_validacao"),
  dataAprovacao: date("data_aprovacao"),
  aprovadoPor: text("aprovado_por"),

  // ── Color Architecture ────────────────────────────────────────────────────
  corPrimariaNome: text("cor_primaria_nome"),
  corPrimariaHex: text("cor_primaria_hex"),
  corPrimariaRgb: text("cor_primaria_rgb"),
  corPrimariaDefesa: text("cor_primaria_defesa"),

  corSecundariaNome: text("cor_secundaria_nome"),
  corSecundariaHex: text("cor_secundaria_hex"),
  corSecundariaRgb: text("cor_secundaria_rgb"),
  corSecundariaDefesa: text("cor_secundaria_defesa"),

  coresSuporte: jsonb("cores_suporte").$type<CorSuporte[]>(),
  corBackgroundHex: text("cor_background_hex"),
  corMutedHex: text("cor_muted_hex"),

  // ── Typography System ─────────────────────────────────────────────────────
  fontDisplayFamilia: text("font_display_familia"),
  fontDisplayPeso: text("font_display_peso"),
  fontDisplayDefesa: text("font_display_defesa"),

  fontBodyFamilia: text("font_body_familia"),
  fontBodyPeso: text("font_body_peso"),
  fontBodyDefesa: text("font_body_defesa"),

  fontAccentFamilia: text("font_accent_familia"),
  fontAccentUso: text("font_accent_uso"),

  regrasHierarquiaTipografica: text("regras_hierarquia_tipografica"),

  // ── Visual Constraints (5 proibições absolutas) ───────────────────────────
  restricoesVisuais: text("restricoes_visuais").array(),

  // ── Logo Direction ────────────────────────────────────────────────────────
  logoConceitoCentral: text("logo_conceito_central"),
  logoForma: text("logo_forma"),
  logoPesoVisual: text("logo_peso_visual"),
  logoComunicacao1Segundo: text("logo_comunicacao_1_segundo"),
  logoNuncaParecer: text("logo_nunca_parecer"),

  // ── Strategic Justification ───────────────────────────────────────────────
  justificativaEstrategica: text("justificativa_estrategica"),

  // XML bruto gerado pelo brand-strategist-visual (backup/audit)
  bdpXmlRaw: text("bdp_xml_raw"),

  // ── GATE HARD: Aprovação da Glenda (Etapa 02) ─────────────────────────────
  // Studios 1, 2, 3, 4 NÃO podem iniciar sem glendaAprovado = TRUE
  glendaAprovado: boolean("glenda_aprovado").notNull().default(false),
  glendaAprovadoEm: timestamp("glenda_aprovado_em", { withTimezone: true }),

  // ── GATE HARD: Logo em Base64 (preenchido pelo Studio 1) ──────────────────
  // Studios 2, 3 e 4 exigem este campo NOT NULL em runtime
  // NULL = Studio 1 ainda não executou ou não foi aprovado
  // Trigger trg_studio_logo_gate bloqueia INSERT em studio_execucoes se NULL
  logoBase64: text("logo_base64"),       // base64 da logo aprovada pela Glenda
  logoAprovadaNome: text("logo_aprovada_nome"),   // nome do conceito escolhido
  logoAprovadaEm: timestamp("logo_aprovada_em", { withTimezone: true }),

  // ── Snapshots da Etapa 02 (rastreabilidade) ───────────────────────────────
  // Inputs que alimentaram o BDP — guardados para auditoria
  handoffEstrategicoMd: text("handoff_estrategico_md"),  // do Vértice
  copyForenseImd: text("copy_forense_i_md"),             // criativos
  copyForenseIImd: text("copy_forense_ii_md"),           // reels + editorial
  tendenciasUsadas: jsonb("tendencias_usadas"),           // snapshot tendencias-plataforma

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Brandkit = typeof brandkits.$inferSelect;
export type NewBrandkit = typeof brandkits.$inferInsert;
