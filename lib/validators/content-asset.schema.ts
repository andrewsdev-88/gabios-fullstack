/**
 * gabiOS — lib/validators/content-asset.schema.ts
 * Schemas Zod para content_assets (linha de montagem Etapa 04).
 */

import { z } from "zod";

export const assetTipoValues = ["reel", "story", "post_feed", "post_carrossel"] as const;
export const assetFormatoValues = ["video", "imagem", "carrossel"] as const;
export const assetStatusValues = [
  "roteiro_gerado",
  "aguardando_gravacao",
  "gravado",
  "em_edicao",
  "aguardando_aprovacao",
  "aprovado",
  "rejeitado",
  "publicado",
] as const;

export const createContentAssetSchema = z.object({
  cycleId: z.string().uuid(),
  clientId: z.string().uuid(),
  tipo: z.enum(assetTipoValues),
  formato: z.enum(assetFormatoValues).default("video"),
  numeroSequencia: z.number().int().min(1).max(20).optional(),
  letraRevelacao: z.string().max(2).optional(),
  origemRoteiro: z
    .enum(["copy_forense_i", "copy_forense_ii", "revelacao"])
    .optional(),
  roteiroBase: z.string().optional(),
  roteiroCinematografico: z.string().optional(),
  ganchoPrimeiros3s: z.string().optional(),
  ctaOrganico: z.string().optional(),
  direcaoCamera: z.string().optional(),
  trilhaSugerida: z.string().optional(),
  instrucaoLegenda: z.string().optional(),
  deadlineAprovacao: z.string().date().optional(),
  plataformas: z.array(z.string()).optional(),
  dataPublicacaoPrevista: z.string().date().optional(),
});

export const updateAssetStatusSchema = z.object({
  status: z.enum(assetStatusValues),
  aprovadoPor: z.string().optional(),
  notasRejeicao: z.string().optional(),
  dataAprovacao: z.string().date().optional(),
  dataPublicacaoReal: z.string().date().optional(),
  urlPublicado: z.string().url().optional(),
});

export const updateAssetMetricsSchema = z.object({
  views: z.number().int().nonnegative().optional(),
  likes: z.number().int().nonnegative().optional(),
  comentarios: z.number().int().nonnegative().optional(),
  compartilhamentos: z.number().int().nonnegative().optional(),
  saves: z.number().int().nonnegative().optional(),
  taxaEngajamento: z.number().min(0).max(100).optional(),
});

export type CreateContentAssetInput = z.infer<typeof createContentAssetSchema>;
export type UpdateAssetStatusInput = z.infer<typeof updateAssetStatusSchema>;
export type UpdateAssetMetricsInput = z.infer<typeof updateAssetMetricsSchema>;
