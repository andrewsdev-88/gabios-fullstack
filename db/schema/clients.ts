/**
 * gabiOS — Schema: clients
 * Entidade central. Perfil base do cliente e status no funil PRISMA (Etapas 00–05).
 */

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  date,
  timestamp,
} from "drizzle-orm/pg-core";


// ─── Enums ────────────────────────────────────────────────────────────────────

export const funilEtapaEnum = pgEnum("funil_etapa", [
  "etapa_00", // Captação / lead qualificado
  "etapa_01", // IDI aplicado
  "etapa_02", // Council + Vértice concluídos
  "etapa_03", // BDP aprovado
  "etapa_04", // Produção de conteúdo ativa
  "etapa_05", // Ciclo encerrado / relatório final entregue
]);

export const planoEnum = pgEnum("plano_contratado", [
  "basico",
  "intermediario",
  "premium",
]);

// ─── Table ────────────────────────────────────────────────────────────────────

export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: text("nome").notNull(),
  empresa: text("empresa"),
  segmento: text("segmento"),
  telefone: text("telefone"),
  email: text("email"),
  instagramHandle: text("instagram_handle"),

  // Funil PRISMA
  funilEtapa: funilEtapaEnum("funil_etapa").notNull().default("etapa_00"),
  planoContratado: planoEnum("plano_contratado"),

  ativo: boolean("ativo").notNull().default(true),
  dataEntrada: date("data_entrada"),
  dataEncerramento: date("data_encerramento"),
  notasQualificacao: text("notas_qualificacao"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Relations (declaradas depois das outras tabelas no index) ─────────────────

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
