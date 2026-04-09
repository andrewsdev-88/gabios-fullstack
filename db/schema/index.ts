/**
 * gabiOS — db/schema/index.ts
 * Barrel: exporta todos os schemas e declara as relations do Drizzle.
 */

// ─── Schemas ──────────────────────────────────────────────────────────────────
export * from "./clients";
export * from "./idi-responses";
export * from "./brandkits";
export * from "./studio-execucoes"; // NOVO — pipeline Studios 0–4
export * from "./content-cycles";
export * from "./content-assets";
export * from "./espelho-logs";


// ─── Relations ────────────────────────────────────────────────────────────────
import { relations } from "drizzle-orm";
import { clients } from "./clients";
import { idiResponses } from "./idi-responses";
import { brandkits } from "./brandkits";
import { studioExecucoes } from "./studio-execucoes";
import { contentCycles } from "./content-cycles";
import { contentAssets } from "./content-assets";
import { espelhoLogs } from "./espelho-logs";

export const clientsRelations = relations(clients, ({ many }) => ({
  idiResponses: many(idiResponses),
  brandkits: many(brandkits),
  studioExecucoes: many(studioExecucoes),  // pipeline Studios
  contentCycles: many(contentCycles),
  contentAssets: many(contentAssets),
  espelhoLogs: many(espelhoLogs),
}));

export const idiResponsesRelations = relations(idiResponses, ({ one }) => ({
  client: one(clients, {
    fields: [idiResponses.clientId],
    references: [clients.id],
  }),
}));

export const brandkitsRelations = relations(brandkits, ({ one, many }) => ({
  client: one(clients, {
    fields: [brandkits.clientId],
    references: [clients.id],
  }),
  studioExecucoes: many(studioExecucoes), // Studios dependem do BDP
  contentCycles: many(contentCycles),
}));

export const studioExecucoesRelations = relations(studioExecucoes, ({ one }) => ({
  client: one(clients, {
    fields: [studioExecucoes.clientId],
    references: [clients.id],
  }),
  brandkit: one(brandkits, {
    fields: [studioExecucoes.brandkitId],
    references: [brandkits.id],
  }),
}));

export const contentCyclesRelations = relations(contentCycles, ({ one, many }) => ({
  client: one(clients, {
    fields: [contentCycles.clientId],
    references: [clients.id],
  }),
  brandkit: one(brandkits, {
    fields: [contentCycles.brandkitId],
    references: [brandkits.id],
  }),
  contentAssets: many(contentAssets),
  espelhoLog: one(espelhoLogs, {
    fields: [contentCycles.id],
    references: [espelhoLogs.cycleId],
  }),
}));

export const contentAssetsRelations = relations(contentAssets, ({ one }) => ({
  cycle: one(contentCycles, {
    fields: [contentAssets.cycleId],
    references: [contentCycles.id],
  }),
  client: one(clients, {
    fields: [contentAssets.clientId],
    references: [clients.id],
  }),
}));

export const espelhoLogsRelations = relations(espelhoLogs, ({ one }) => ({
  cycle: one(contentCycles, {
    fields: [espelhoLogs.cycleId],
    references: [contentCycles.id],
  }),
  client: one(clients, {
    fields: [espelhoLogs.clientId],
    references: [clients.id],
  }),
}));
