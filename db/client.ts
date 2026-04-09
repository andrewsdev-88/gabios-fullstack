/**
 * gabiOS — db/client.ts
 * Instância única do Drizzle ORM conectado ao Supabase (PostgreSQL via pool).
 * Usar APENAS em contextos server-side (Route Handlers, Server Actions, scripts).
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Garante que DATABASE_URL está definida
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL não está definida. Adicione ao .env.local: DATABASE_URL=postgresql://..."
  );
}

// Pool singleton — evita abrir múltiplas conexões em dev com hot reload
const globalForDb = globalThis as unknown as {
  connection: postgres.Sql | undefined;
};

const connection =
  globalForDb.connection ??
  postgres(process.env.DATABASE_URL, {
    // Supabase suporta até 15 conexões no plano free; ajustar em produção
    max: process.env.NODE_ENV === "production" ? 10 : 3,
    prepare: false, // necessário para Supabase Pooler (Transaction mode)
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.connection = connection;
}

export const db = drizzle(connection, { schema });

export type DB = typeof db;
