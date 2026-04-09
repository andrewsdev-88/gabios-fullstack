/**
 * gabiOS — lib/validators/idi.schema.ts
 * Schemas Zod para validação do Protocolo IDI (inputs e outputs).
 */

import { z } from "zod";

// Blocos individuais — permitem input parcial (IDI pode ser preenchido em partes)

export const blocoMbtiSchema = z.object({
  q1Ei: z.enum(["E", "I", "I_E_situacional"]).optional(),
  q2Sn: z.enum(["S", "N", "NS_equilibrado"]).optional(),
  q3Tf: z.enum(["T", "F", "equilibrado"]).optional(),
  q4Jp: z.enum(["J", "P", "situacional"]).optional(),
  mbtiTipo: z.string().max(4).optional(),
  mbtiGrupo: z.enum(["Analista", "Diplomata", "Sentinela", "Explorador"]).optional(),
});

export const blocoEnergiaSchema = z.object({
  energiaFogo: z.number().int().min(1).max(5).optional(),
  energiaTerra: z.number().int().min(1).max(5).optional(),
  energiaAgua: z.number().int().min(1).max(5).optional(),
  energiaAr: z.number().int().min(1).max(5).optional(),
  energiaMetal: z.number().int().min(1).max(5).optional(),
});

export const blocoSeteCamadasSchema = z.object({
  c1Projeto: z.string().optional(),
  c2Autoimagem: z.string().optional(),
  c3Autoconhecimento: z.string().optional(),
  c4Qi: z.string().optional(),
  c5Qe: z.string().optional(),
  c6Qs: z.string().optional(),
  c7Plenitude: z.string().optional(),
});

export const blocoGenialidadeSchema = z.object({
  q13Genialidade: z.string().optional(),
  q14Mediocridade: z.string().optional(),
  q15Competencia: z.string().optional(),
  q16GenialidadeOculta: z.string().optional(),
});

export const blocoAutossabotagemSchema = z.object({
  q17Ciclo: z.string().optional(),
  q18BDominante: z.array(z.string()).optional(),
  q19EventoInjustica: z.array(z.string()).optional(),
});

export const blocoContextoSchema = z.object({
  q20Gatilho: z.string().optional(),
  q21Prontidao: z.number().int().min(1).max(5).optional(),
  q22VisaoSucesso: z.string().optional(),
});

// Schema completo para criação de uma sessão IDI
export const createIdiSchema = z.object({
  clientId: z.string().uuid(),
  aplicador: z.string().optional(),
  dataAplicacao: z.string().datetime({ offset: true }).optional(),
  formatoInput: z
    .enum(["texto_estruturado", "texto_livre", "anotacoes", "upload_print"])
    .optional(),
})
  .merge(blocoMbtiSchema)
  .merge(blocoEnergiaSchema)
  .merge(blocoSeteCamadasSchema)
  .merge(blocoGenialidadeSchema)
  .merge(blocoAutossabotagemSchema)
  .merge(blocoContextoSchema);

// Schema para salvar os outputs do IDI Squad
export const idiOutputSchema = z.object({
  perfilIdentidadeMd: z.string().optional(),
  manualRelacionamentoMd: z.string().optional(),
  promptMasterMd: z.string().optional(),
  potencialNaoRealizado: z.string().optional(),
  arquetipoPrimario: z.string().optional(),
  arquetipoSecundario: z.string().optional(),
  status: z.enum(["bruto", "processado", "finalizado"]).optional(),
});

export type CreateIdiInput = z.infer<typeof createIdiSchema>;
export type IdiOutputInput = z.infer<typeof idiOutputSchema>;
