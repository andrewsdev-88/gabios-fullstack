/**
 * gabiOS — lib/validators/client.schema.ts
 * Schemas Zod para validação de inputs da entidade clients.
 */

import { z } from "zod";

const funilEtapaValues = [
  "etapa_00",
  "etapa_01",
  "etapa_02",
  "etapa_03",
  "etapa_04",
  "etapa_05",
] as const;

const planoValues = ["basico", "intermediario", "premium"] as const;

export const createClientSchema = z.object({
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  empresa: z.string().optional(),
  segmento: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
  instagramHandle: z.string().optional(),
  funilEtapa: z.enum(funilEtapaValues).default("etapa_00"),
  planoContratado: z.enum(planoValues).optional(),
  ativo: z.boolean().default(true),
  dataEntrada: z.string().date().optional(), // ISO date string "YYYY-MM-DD"
  notasQualificacao: z.string().optional(),
});

export const updateClientSchema = createClientSchema.partial();

export const clientIdSchema = z.object({
  id: z.string().uuid("ID inválido"),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
