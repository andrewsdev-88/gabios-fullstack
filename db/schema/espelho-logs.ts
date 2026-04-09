/**
 * gabiOS — Schema: espelho_logs
 * Logs de PDCA por ciclo mensal.
 * Registra o quadrante completo PLAN/DO/CHECK/ACT do Espelho PRISMA.
 */

import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  date,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { contentCycles } from "./content-cycles";
import { clients } from "./clients";

// ─── Tipos auxiliares (JSONB) ─────────────────────────────────────────────────

export type AjusteSkill = {
  skill: string;
  ajuste: string;
  prioridade: "alta" | "media" | "baixa";
};

export type MetasCiclo = {
  metrica: string;
  valor: string | number;
}[];

// ─── Table ────────────────────────────────────────────────────────────────────

export const espelhoLogs = pgTable("espelho_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  cycleId: uuid("cycle_id")
    .notNull()
    .references(() => contentCycles.id, { onDelete: "cascade" }),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),

  dataRetrospectiva: date("data_retrospectiva"),
  geradoPor: text("gerado_por"), // ex: "Glenda"

  // ── PLAN — O que foi projetado ────────────────────────────────────────────
  planMetas: jsonb("plan_metas").$type<MetasCiclo>(),
  planPostsPrevistos: integer("plan_posts_previstos"),
  planReelsPrevistos: integer("plan_reels_previstos"),
  planPlataformas: text("plan_plataformas").array(),
  planFrequenciaEditorial: text("plan_frequencia_editorial"),

  // ── DO — O que foi entregue ───────────────────────────────────────────────
  doPostsPublicados: integer("do_posts_publicados"),
  doReelsPublicados: integer("do_reels_publicados"),
  doFeedbackCliente: text("do_feedback_cliente"),
  doMetricasReais: jsonb("do_metricas_reais"),

  // ── CHECK — Análise do gap ────────────────────────────────────────────────
  checkGapExecucao: text("check_gap_execucao"),
  checkTopContent: text("check_top_content"),
  checkBottomContent: text("check_bottom_content"),
  checkLetraMelhorPerformance: text("check_letra_melhor_performance"),
  checkTipoConteudoRessoou: text("check_tipo_conteudo_ressoou"),
  checkAnaliseSistema: text("check_analise_sistema"),
  checkDesvioDeVoz: boolean("check_desvio_de_voz").default(false),
  checkBdpNeedsUpdate: text("check_bdp_needs_update"),

  // ── ACT — Ajustes para o próximo ciclo ───────────────────────────────────
  actAjustesSkill: jsonb("act_ajustes_skill").$type<AjusteSkill[]>(),
  actAjustesEstrategia: text("act_ajustes_estrategia"),
  actAjustesProducao: text("act_ajustes_producao"),
  actAtualizacaoBdp: text("act_atualizacao_bdp"),
  actTemaAncoraProximoCiclo: text("act_tema_ancora_proximo_ciclo"),
  actAjustePrioritario: text("act_ajuste_prioritario_antes_de_reiniciar"),
  actDirecaoVerticeProximoCiclo: text("act_direcao_vertice_proximo_ciclo"),

  // Output Markdown consolidado (gerado pelo espelho-prisma)
  relatorioEspelhoMd: text("relatorio_espelho_md"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type EspelhoLog = typeof espelhoLogs.$inferSelect;
export type NewEspelhoLog = typeof espelhoLogs.$inferInsert;
