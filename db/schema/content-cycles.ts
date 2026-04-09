/**
 * gabiOS — Schema: content_cycles
 * Ciclos mensais de produção — liga cliente, brandkit, reels e stories.
 * Um ciclo = um mês de produção para um cliente.
 */

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  date,
  timestamp,
} from "drizzle-orm/pg-core";
import { clients } from "./clients";
import { brandkits } from "./brandkits";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const cicloStatusEnum = pgEnum("ciclo_status", [
  "planejamento", // Vértice + Revelação sendo definidos
  "producao",     // roteirista-prisma gerando roteiros + criação em andamento
  "revisao",      // Glenda revisando entregas
  "publicado",    // conteúdo no ar
  "encerrado",    // Espelho rodado, ciclo fechado
]);

// ─── Table ────────────────────────────────────────────────────────────────────

export const contentCycles = pgTable("content_cycles", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  brandkitId: uuid("brandkit_id")
    .references(() => brandkits.id, { onDelete: "set null" }),

  // "2025-06" — mês de referência
  mesReferencia: text("mes_referencia").notNull(),
  statusCiclo: cicloStatusEnum("status_ciclo").notNull().default("planejamento"),

  // Volumes contratados (fixos por plano)
  reelsContratados: integer("reels_contratados").notNull().default(4),   // 4 ou 8
  storiesContratados: integer("stories_contratados").notNull().default(20), // sempre 20

  dataInicio: date("data_inicio"),
  dataEncerramento: date("data_encerramento"),

  // Handoff do Vértice (markdown)
  handoffVerticeMd: text("handoff_vertice_md"),
  temaAncoraMes: text("tema_ancora_do_mes"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ContentCycle = typeof contentCycles.$inferSelect;
export type NewContentCycle = typeof contentCycles.$inferInsert;
