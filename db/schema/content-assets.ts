/**
 * gabiOS — Schema: content_assets
 * Linha de montagem da Etapa 04.
 * Cada registro = 1 vídeo (reel ou story) no pipeline de produção.
 * Controla roteiro, status de aprovação (prazo 20 dias úteis) e métricas pós-publicação.
 */

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  date,
  timestamp,
  decimal,
} from "drizzle-orm/pg-core";
import { contentCycles } from "./content-cycles";
import { clients } from "./clients";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const assetTipoEnum = pgEnum("asset_tipo", [
  "reel",
  "story",
  "post_feed",
  "post_carrossel",
]);

export const assetFormatoEnum = pgEnum("asset_formato", [
  "video",
  "imagem",
  "carrossel",
]);

export const assetStatusEnum = pgEnum("asset_status", [
  "roteiro_gerado",       // roteiro base disponível, ainda não elevado
  "aguardando_gravacao",  // roteiro cinematográfico entregue, aguarda gravação
  "gravado",              // vídeo bruto recebido
  "em_edicao",            // na fila de edição
  "aguardando_aprovacao", // enviado para Glenda revisar
  "aprovado",             // Glenda aprovou — pronto para publicar
  "rejeitado",            // Glenda rejeitou — volta para revisão
  "publicado",            // no ar
]);

export const origemRoteiroEnum = pgEnum("origem_roteiro", [
  "copy_forense_i",
  "copy_forense_ii",
  "revelacao",
]);

// ─── Table ────────────────────────────────────────────────────────────────────

export const contentAssets = pgTable("content_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  cycleId: uuid("cycle_id")
    .notNull()
    .references(() => contentCycles.id, { onDelete: "cascade" }),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),

  tipo: assetTipoEnum("tipo").notNull(),
  formato: assetFormatoEnum("formato").notNull().default("video"),
  numeroSequencia: integer("numero_sequencia"), // 1..20 stories / 1..8 reels

  // Estrutura narrativa (REVELAÇÃO)
  letraRevelacao: text("letra_revelacao"), // "R"|"E"|"V"|"E"|"L"|"A"|"Ç"|"Ã"|"O"
  origemRoteiro: origemRoteiroEnum("origem_roteiro"),

  // ── Roteiro ───────────────────────────────────────────────────────────────
  roteiroBase: text("roteiro_base"),
  roteiroCinematografico: text("roteiro_cinematografico"),
  ganchoPrimeiros3s: text("gancho_primeiros_3s"),
  ctaOrganico: text("cta_organico"),
  direcaoCamera: text("direcao_camera"),
  trilhaSugerida: text("trilha_sugerida"),
  instrucaoLegenda: text("instrucao_legenda"),

  // ── Status de Aprovação ───────────────────────────────────────────────────
  status: assetStatusEnum("status").notNull().default("roteiro_gerado"),
  deadlineAprovacao: date("deadline_aprovacao"), // +20 dias úteis a partir do ciclo
  dataAprovacao: date("data_aprovacao"),
  aprovadoPor: text("aprovado_por"),
  notasRejeicao: text("notas_rejeicao"),
  numeroRevisoes: integer("numero_revisoes").notNull().default(0),

  // ── Publicação ────────────────────────────────────────────────────────────
  plataformas: text("plataformas").array(), // ["instagram","tiktok"]
  dataPublicacaoPrevista: date("data_publicacao_prevista"),
  dataPublicacaoReal: date("data_publicacao_real"),
  urlPublicado: text("url_publicado"),

  // ── Métricas pós-publicação ───────────────────────────────────────────────
  views: integer("views"),
  likes: integer("likes"),
  comentarios: integer("comentarios"),
  compartilhamentos: integer("compartilhamentos"),
  saves: integer("saves"),
  taxaEngajamento: decimal("taxa_engajamento", { precision: 5, scale: 2 }),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ContentAsset = typeof contentAssets.$inferSelect;
export type NewContentAsset = typeof contentAssets.$inferInsert;
