CREATE TYPE "public"."asset_formato" AS ENUM('video', 'imagem', 'carrossel');--> statement-breakpoint
CREATE TYPE "public"."asset_status" AS ENUM('roteiro_gerado', 'aguardando_gravacao', 'gravado', 'em_edicao', 'aguardando_aprovacao', 'aprovado', 'rejeitado', 'publicado');--> statement-breakpoint
CREATE TYPE "public"."asset_tipo" AS ENUM('reel', 'story', 'post_feed', 'post_carrossel');--> statement-breakpoint
CREATE TYPE "public"."brandkit_status" AS ENUM('aguardando_validacao', 'aprovado', 'revisao', 'logo_gravada', 'arquivado');--> statement-breakpoint
CREATE TYPE "public"."ciclo_status" AS ENUM('planejamento', 'producao', 'revisao', 'publicado', 'encerrado');--> statement-breakpoint
CREATE TYPE "public"."funil_etapa" AS ENUM('etapa_00', 'etapa_01', 'etapa_02', 'etapa_03', 'etapa_04', 'etapa_05');--> statement-breakpoint
CREATE TYPE "public"."idi_formato_input" AS ENUM('texto_estruturado', 'texto_livre', 'anotacoes', 'upload_print');--> statement-breakpoint
CREATE TYPE "public"."idi_status" AS ENUM('bruto', 'processado', 'finalizado');--> statement-breakpoint
CREATE TYPE "public"."origem_roteiro" AS ENUM('copy_forense_i', 'copy_forense_ii', 'revelacao');--> statement-breakpoint
CREATE TYPE "public"."plano_contratado" AS ENUM('basico', 'intermediario', 'premium');--> statement-breakpoint
CREATE TYPE "public"."studio_numero_enum" AS ENUM('0', '1', '2', '3', '4');--> statement-breakpoint
CREATE TYPE "public"."studio_status" AS ENUM('pending', 'running', 'approved', 'blocked', 'failed', 'skipped');--> statement-breakpoint
CREATE TABLE "brandkits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"versao" text DEFAULT '1.0' NOT NULL,
	"status" "brandkit_status" DEFAULT 'aguardando_validacao' NOT NULL,
	"data_aprovacao" date,
	"aprovado_por" text,
	"cor_primaria_nome" text,
	"cor_primaria_hex" text,
	"cor_primaria_rgb" text,
	"cor_primaria_defesa" text,
	"cor_secundaria_nome" text,
	"cor_secundaria_hex" text,
	"cor_secundaria_rgb" text,
	"cor_secundaria_defesa" text,
	"cores_suporte" jsonb,
	"cor_background_hex" text,
	"cor_muted_hex" text,
	"font_display_familia" text,
	"font_display_peso" text,
	"font_display_defesa" text,
	"font_body_familia" text,
	"font_body_peso" text,
	"font_body_defesa" text,
	"font_accent_familia" text,
	"font_accent_uso" text,
	"regras_hierarquia_tipografica" text,
	"restricoes_visuais" text[],
	"logo_conceito_central" text,
	"logo_forma" text,
	"logo_peso_visual" text,
	"logo_comunicacao_1_segundo" text,
	"logo_nunca_parecer" text,
	"justificativa_estrategica" text,
	"bdp_xml_raw" text,
	"glenda_aprovado" boolean DEFAULT false NOT NULL,
	"glenda_aprovado_em" timestamp with time zone,
	"logo_base64" text,
	"logo_aprovada_nome" text,
	"logo_aprovada_em" timestamp with time zone,
	"handoff_estrategico_md" text,
	"copy_forense_i_md" text,
	"copy_forense_ii_md" text,
	"tendencias_usadas" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"empresa" text,
	"segmento" text,
	"telefone" text,
	"email" text,
	"instagram_handle" text,
	"funil_etapa" "funil_etapa" DEFAULT 'etapa_00' NOT NULL,
	"plano_contratado" "plano_contratado",
	"ativo" boolean DEFAULT true NOT NULL,
	"data_entrada" date,
	"data_encerramento" date,
	"notas_qualificacao" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cycle_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"tipo" "asset_tipo" NOT NULL,
	"formato" "asset_formato" DEFAULT 'video' NOT NULL,
	"numero_sequencia" integer,
	"letra_revelacao" text,
	"origem_roteiro" "origem_roteiro",
	"roteiro_base" text,
	"roteiro_cinematografico" text,
	"gancho_primeiros_3s" text,
	"cta_organico" text,
	"direcao_camera" text,
	"trilha_sugerida" text,
	"instrucao_legenda" text,
	"status" "asset_status" DEFAULT 'roteiro_gerado' NOT NULL,
	"deadline_aprovacao" date,
	"data_aprovacao" date,
	"aprovado_por" text,
	"notas_rejeicao" text,
	"numero_revisoes" integer DEFAULT 0 NOT NULL,
	"plataformas" text[],
	"data_publicacao_prevista" date,
	"data_publicacao_real" date,
	"url_publicado" text,
	"views" integer,
	"likes" integer,
	"comentarios" integer,
	"compartilhamentos" integer,
	"saves" integer,
	"taxa_engajamento" numeric(5, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_cycles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"brandkit_id" uuid,
	"mes_referencia" text NOT NULL,
	"status_ciclo" "ciclo_status" DEFAULT 'planejamento' NOT NULL,
	"reels_contratados" integer DEFAULT 4 NOT NULL,
	"stories_contratados" integer DEFAULT 20 NOT NULL,
	"data_inicio" date,
	"data_encerramento" date,
	"handoff_vertice_md" text,
	"tema_ancora_do_mes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "espelho_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cycle_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"data_retrospectiva" date,
	"gerado_por" text,
	"plan_metas" jsonb,
	"plan_posts_previstos" integer,
	"plan_reels_previstos" integer,
	"plan_plataformas" text[],
	"plan_frequencia_editorial" text,
	"do_posts_publicados" integer,
	"do_reels_publicados" integer,
	"do_feedback_cliente" text,
	"do_metricas_reais" jsonb,
	"check_gap_execucao" text,
	"check_top_content" text,
	"check_bottom_content" text,
	"check_letra_melhor_performance" text,
	"check_tipo_conteudo_ressoou" text,
	"check_analise_sistema" text,
	"check_desvio_de_voz" boolean DEFAULT false,
	"check_bdp_needs_update" text,
	"act_ajustes_skill" jsonb,
	"act_ajustes_estrategia" text,
	"act_ajustes_producao" text,
	"act_atualizacao_bdp" text,
	"act_tema_ancora_proximo_ciclo" text,
	"act_ajuste_prioritario_antes_de_reiniciar" text,
	"act_direcao_vertice_proximo_ciclo" text,
	"relatorio_espelho_md" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "idi_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"aplicador" text,
	"data_aplicacao" timestamp with time zone,
	"formato_input" "idi_formato_input",
	"q1_ei" text,
	"q2_sn" text,
	"q3_tf" text,
	"q4_jp" text,
	"mbti_tipo" text,
	"mbti_grupo" text,
	"energia_fogo" integer,
	"energia_terra" integer,
	"energia_agua" integer,
	"energia_ar" integer,
	"energia_metal" integer,
	"energia_dominante" text,
	"energia_presente" text,
	"energia_ausente" text,
	"c1_projeto" text,
	"c2_autoimagem" text,
	"c3_autoconhecimento" text,
	"c4_qi" text,
	"c5_qe" text,
	"c6_qs" text,
	"c7_plenitude" text,
	"camada_predominante" text,
	"tensao_camadas" text,
	"q13_genialidade" text,
	"q14_mediocridade" text,
	"q15_competencia" text,
	"q16_genialidade_oculta" text,
	"q17_ciclo" text,
	"q18_b_dominante" text[],
	"q19_evento_injustica" text[],
	"q20_gatilho" text,
	"q21_prontidao" integer,
	"q22_visao_sucesso" text,
	"perfil_identidade_md" text,
	"manual_relacionamento_md" text,
	"prompt_master_md" text,
	"potencial_nao_realizado" text,
	"arquetipo_primario" text,
	"arquetipo_secundario" text,
	"status" "idi_status" DEFAULT 'bruto' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "studio_execucoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"brandkit_id" uuid NOT NULL,
	"studio_numero" smallint NOT NULL,
	"studio_nome" text NOT NULL,
	"status" "studio_status" DEFAULT 'pending' NOT NULL,
	"output_url" text,
	"output_base64" text,
	"output_md" text,
	"bloqueio_motivo" text,
	"canvas_tester_passou" boolean,
	"canvas_tester_log" text,
	"glenda_aprovado" boolean DEFAULT false NOT NULL,
	"glenda_aprovado_em" timestamp with time zone,
	"glenda_observacoes" text,
	"tentativas" smallint DEFAULT 0 NOT NULL,
	"iniciado_em" timestamp with time zone,
	"concluido_em" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "brandkits" ADD CONSTRAINT "brandkits_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_assets" ADD CONSTRAINT "content_assets_cycle_id_content_cycles_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."content_cycles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_assets" ADD CONSTRAINT "content_assets_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_cycles" ADD CONSTRAINT "content_cycles_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_cycles" ADD CONSTRAINT "content_cycles_brandkit_id_brandkits_id_fk" FOREIGN KEY ("brandkit_id") REFERENCES "public"."brandkits"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "espelho_logs" ADD CONSTRAINT "espelho_logs_cycle_id_content_cycles_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."content_cycles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "espelho_logs" ADD CONSTRAINT "espelho_logs_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "idi_responses" ADD CONSTRAINT "idi_responses_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studio_execucoes" ADD CONSTRAINT "studio_execucoes_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studio_execucoes" ADD CONSTRAINT "studio_execucoes_brandkit_id_brandkits_id_fk" FOREIGN KEY ("brandkit_id") REFERENCES "public"."brandkits"("id") ON DELETE cascade ON UPDATE no action;