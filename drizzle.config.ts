/**
 * gabiOS — drizzle.config.ts
 * Configuração do Drizzle Kit para geração de migrations SQL contra Supabase.
 *
 * Comandos:
 *   npx drizzle-kit generate  → gera a migration SQL em db/migrations/
 *   npx drizzle-kit migrate   → aplica as migrations no banco
 *   npx drizzle-kit studio    → abre o Drizzle Studio visual
 */

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema/index.ts",
  out: "./db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Prefere nomes explícitos em vez de auto-gerados
  verbose: true,
  strict: true,
});
