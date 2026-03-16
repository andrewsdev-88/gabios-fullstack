/**
 * lib/templates/index.ts
 * Definição dos 9 templates com estrutura completa
 */

export interface SlideTemplate {
  position: number;
  title: string;
  structure: string[];
}

export interface BrandKit {
  primaryColors: string[];
  secondaryColors: string[];
  typography: {
    heading: string;
    body: string;
  };
  patterns: string[];
}

export interface Template {
  id: number;
  name: string;
  positioning: {
    eixo_razao_emocao: "razao_alta" | "razao_media" | "emocao_alta";
    eixo_maturidade: "imatura" | "media" | "madura";
    target_industries: string[];
    description: string;
  };
  tone_of_voice: string[];
  slide_structure: SlideTemplate[];
  brandkit: BrandKit;
}

export const TEMPLATES: Record<number, Template> = {
  1: {
    id: 1,
    name: "Educativo Consultivo",
    positioning: {
      eixo_razao_emocao: "razao_alta",
      eixo_maturidade: "imatura",
      target_industries: ["PME local", "Varejo", "Alimentação"],
      description:
        "Educação e consultoria para negócios iniciantes ou sem marca consolidada",
    },
    tone_of_voice: [
      "Acessível",
      "Explicativo",
      "Didático",
      "Confiável",
      "Prático",
    ],
    slide_structure: [
      {
        position: 1,
        title: "Apresentação do Cliente",
        structure: [
          "Logo do cliente em destaque",
          "Nome da empresa",
          "Segmento/setor",
          "Tagline ou principal serviço",
        ],
      },
      {
        position: 2,
        title: "O Problema Identificado",
        structure: [
          "Desafio principal do cliente",
          "Impacto no negócio",
          "Dados atuais (se disponível)",
        ],
      },
      {
        position: 3,
        title: "Oportunidade",
        structure: [
          "Como a Gabi pode ajudar",
          "Diferencial de abordagem",
          "Primeiros passos",
        ],
      },
      {
        position: 4,
        title: "Estratégia de Comunicação",
        structure: [
          "Canais recomendados",
          "Tom de voz do cliente",
          "Foco do posicionamento",
        ],
      },
      {
        position: 5,
        title: "Público-Alvo",
        structure: [
          "Persona principal",
          "Dores e desejos",
          "Jornada do cliente",
        ],
      },
      {
        position: 6,
        title: "Proposta de Valor",
        structure: [
          "Por que escolher o cliente (diferenciação)",
          "Benefícios principais",
          "Prova social (se houver)",
        ],
      },
      {
        position: 7,
        title: "Plano de Execução",
        structure: [
          "Fases do projeto",
          "Cronograma",
          "Responsabilidades",
        ],
      },
      {
        position: 8,
        title: "Investimento e ROI",
        structure: [
          "Orçamento estimado",
          "Retorno esperado",
          "Comparação com concorrência",
        ],
      },
      {
        position: 9,
        title: "Casos de Sucesso",
        structure: [
          "Clientes similares atendidos",
          "Resultados obtidos",
          "Depoimentos",
        ],
      },
      {
        position: 10,
        title: "Próximos Passos",
        structure: [
          "Call-to-action claro",
          "Contato e informações",
          "Dúvidas?",
        ],
      },
    ],
    brandkit: {
      primaryColors: ["#0066CC", "#003D7A"],
      secondaryColors: ["#F39200", "#FFFFFF"],
      typography: {
        heading: "Arial, sans-serif, 28px, bold",
        body: "Arial, sans-serif, 14px, regular",
      },
      patterns: ["Ícones educativos", "Infografias", "Tabelas de dados"],
    },
  },

  2: {
    id: 2,
    name: "Técnico Infográfico",
    positioning: {
      eixo_razao_emocao: "razao_alta",
      eixo_maturidade: "media",
      target_industries: ["E-commerce", "Performance", "Franquias"],
      description:
        "Foco em dados, números e estrutura visual de informações complexas",
    },
    tone_of_voice: [
      "Preciso",
      "Orientado por dados",
      "Estruturado",
      "Assertivo",
      "Técnico",
    ],
    slide_structure: [
      {
        position: 1,
        title: "Capa - Apresentação Executiva",
        structure: [
          "Logotipo do cliente",
          "Título da proposta",
          "Data e período analisado",
        ],
      },
      {
        position: 2,
        title: "Análise Atual (Benchmark)",
        structure: [
          "KPIs atuais",
          "Comparativo com mercado",
          "Gráficos e números",
        ],
      },
      {
        position: 3,
        title: "Identificação de Gaps",
        structure: [
          "Pontos fracos detectados",
          "Oportunidades de melhoria",
          "Impacto financeiro",
        ],
      },
      {
        position: 4,
        title: "Recomendações Estratégicas",
        structure: [
          "Soluções proposta",
          "Priorização por impacto",
          "Dependências técnicas",
        ],
      },
      {
        position: 5,
        title: "Tecnologia e Infraestrutura",
        structure: [
          "Stack recomendado",
          "Arquitetura de solução",
          "Integração com sistemas",
        ],
      },
      {
        position: 6,
        title: "Roadmap de Implementação",
        structure: [
          "Timeline faseado",
          "Milestones e entregas",
          "Dependências entre fases",
        ],
      },
      {
        position: 7,
        title: "Projeção de Resultados",
        structure: [
          "KPIs esperados",
          "Cenários (conservador, esperado, otimista)",
          "Gráficos de impacto",
        ],
      },
      {
        position: 8,
        title: "Investimento x Retorno",
        structure: [
          "Custo total do projeto",
          "ROI estimado",
          "Payback period",
        ],
      },
      {
        position: 9,
        title: "Equipe e Governança",
        structure: [
          "Profissionais alocados",
          "Responsabilidades",
          "Metodologia de acompanhamento",
        ],
      },
      {
        position: 10,
        title: "Chamada para Ação",
        structure: [
          "Aprovação do projeto",
          "Cronograma de início",
          "Contatos e suportes",
        ],
      },
    ],
    brandkit: {
      primaryColors: ["#1A1A1A", "#2E7D32"],
      secondaryColors: ["#FF6B35", "#FFFFFF"],
      typography: {
        heading: "Helvetica, sans-serif, 26px, bold",
        body: "Helvetica, sans-serif, 12px, regular",
      },
      patterns: [
        "Gráficos em linha",
        "Barras de progresso",
        "Infografias numéricas",
      ],
    },
  },

  3: {
    id: 3,
    name: "Executivo Estratégico",
    positioning: {
      eixo_razao_emocao: "razao_alta",
      eixo_maturidade: "madura",
      target_industries: ["Médias empresas", "C-level", "Corporativo"],
      description: "Linguagem C-level com foco em estratégia e visão de longo prazo",
    },
    tone_of_voice: [
      "Executivo",
      "Estratégico",
      "Visionário",
      "Profissional",
      "Confiante",
    ],
    slide_structure: [
      {
        position: 1,
        title: "Visão Estratégica",
        structure: [
          "Posicionamento futuro",
          "Objetivo de transformação",
          "Horizonte de tempo",
        ],
      },
      {
        position: 2,
        title: "Contexto de Mercado",
        structure: [
          "Tendências do setor",
          "Movimentos dos concorrentes",
          "Oportunidades macro",
        ],
      },
      {
        position: 3,
        title: "Diagnóstico Estratégico",
        structure: [
          "Forças internas",
          "Vulnerabilidades",
          "Pontos de diferenciação",
        ],
      },
      {
        position: 4,
        title: "Matriz de Prioridades",
        structure: [
          "Eixos de atuação",
          "Iniciativas principais",
          "Critérios de seleção",
        ],
      },
      {
        position: 5,
        title: "Roadmap Estratégico",
        structure: [
          "Horizonte curto (0-6m)",
          "Horizonte médio (6-18m)",
          "Horizonte longo (18-36m)",
        ],
      },
      {
        position: 6,
        title: "Modelo de Governança",
        structure: [
          "Estrutura decisória",
          "Responsabilidades C-level",
          "Cadência de revisão",
        ],
      },
      {
        position: 7,
        title: "Indicadores de Sucesso",
        structure: [
          "KPIs estratégicos",
          "Métricas de outcome",
          "Metas de negócio",
        ],
      },
      {
        position: 8,
        title: "Investimento Estratégico",
        structure: [
          "Alocação de capital",
          "Parcerias necessárias",
          "Recursos humanos",
        ],
      },
      {
        position: 9,
        title: "Cenários e Mitigação de Risco",
        structure: [
          "Cenários possíveis",
          "Planos de contingência",
          "Fatores críticos",
        ],
      },
      {
        position: 10,
        title: "Próximas Decisões",
        structure: [
          "Aprovação executiva",
          "Comitê responsável",
          "Cronograma de workshop de alinhamento",
        ],
      },
    ],
    brandkit: {
      primaryColors: ["#003D7A", "#1A1A1A"],
      secondaryColors: ["#D4AF37", "#FFFFFF"],
      typography: {
        heading: "Garamond, serif, 32px, bold",
        body: "Garamond, serif, 14px, regular",
      },
      patterns: [
        "Ícones corporativos",
        "Matrizes estratégicas",
        "Gráficos de tendência",
      ],
    },
  },

  4: {
    id: 4,
    name: "Confiança Relacional",
    positioning: {
      eixo_razao_emocao: "razao_media",
      eixo_maturidade: "media",
      target_industries: ["Saúde", "Jurídico", "Educação", "Financeiro"],
      description:
        "Comunicação focada em segurança, confiança e relacionamento de longo prazo",
    },
    tone_of_voice: [
      "Empático",
      "Confiável",
      "Responsável",
      "Transparente",
      "Humanizado",
    ],
    slide_structure: [
      {
        position: 1,
        title: "Apresentação com Credibilidade",
        structure: [
          "Histórico e experiência",
          "Certificações relevantes",
          "Testemunhos de clientes",
        ],
      },
      {
        position: 2,
        title: "Compreensão das Necessidades",
        structure: [
          "Escuta ativa do cliente",
          "Desafios específicos",
          "Preocupações atuais",
        ],
      },
      {
        position: 3,
        title: "Proposta Customizada",
        structure: [
          "Solução específica",
          "Adaptação às necessidades",
          "Diferenciais para este cliente",
        ],
      },
      {
        position: 4,
        title: "Processo Transparente",
        structure: [
          "Passo-a-passo da execução",
          "Comunicação prevista",
          "Pontos de decisão",
        ],
      },
      {
        position: 5,
        title: "Suporte e Acompanhamento",
        structure: [
          "Dedicação de equipe",
          "Canais de comunicação",
          "Frequência de check-ins",
        ],
      },
      {
        position: 6,
        title: "Conformidade e Segurança",
        structure: [
          "Regulamentações atendidas",
          "Medidas de proteção de dados",
          "Auditorias e certificações",
        ],
      },
      {
        position: 7,
        title: "Relacionamento Contínuo",
        structure: [
          "Parcerias de longo prazo",
          "Evolução da relação",
          "Planos de expansão futura",
        ],
      },
      {
        position: 8,
        title: "Investimento em Confiança",
        structure: [
          "Modelos de precificação justos",
          "Flexibilidade contratual",
          "Garantias e riscos compartilhados",
        ],
      },
      {
        position: 9,
        title: "Histórias de Sucesso Similares",
        structure: [
          "Casos de clientes do mesmo setor",
          "Resultados tangíveis",
          "Testimonial de impacto",
        ],
      },
      {
        position: 10,
        title: "Início da Parceria",
        structure: [
          "Próximos passos claros",
          "Encontro inicial",
          "Dúvidas? Estamos aqui",
        ],
      },
    ],
    brandkit: {
      primaryColors: ["#005C87", "#1A4D6D"],
      secondaryColors: ["#82B54B", "#FFFFFF"],
      typography: {
        heading: "Trebuchet MS, sans-serif, 28px, bold",
        body: "Trebuchet MS, sans-serif, 13px, regular",
      },
      patterns: [
        "Ícones de relacionamento",
        "Citações de confiança",
        "Linhas de conexão",
      ],
    },
  },

  5: {
    id: 5,
    name: "Regional Aspiracional",
    positioning: {
      eixo_razao_emocao: "razao_media",
      eixo_maturidade: "media",
      target_industries: ["PME local", "Franquias em crescimento"],
      description:
        "Positioning entre o local e o aspiracional, com foco em crescimento e expansão",
    },
    tone_of_voice: [
      "Inspirador",
      "Prático",
      "Comunitário",
      "Ambicioso",
      "Próximo",
    ],
    slide_structure: [
      {
        position: 1,
        title: "Sua História",
        structure: [
          "Origem e jornada",
          "Valores locais",
          "Conexão com comunidade",
        ],
      },
      {
        position: 2,
        title: "Onde Você Está Hoje",
        structure: [
          "Segmento atual",
          "Força competitiva local",
          "Base de clientes",
        ],
      },
      {
        position: 3,
        title: "O Sonho de Crescimento",
        structure: [
          "Visão de expansão",
          "Novo alcance geográfico ou de produto",
          "Inspiração",
        ],
      },
      {
        position: 4,
        title: "Barreiras ao Crescimento",
        structure: [
          "Desafios identificados",
          "Recursos faltantes",
          "Conhecimento necessário",
        ],
      },
      {
        position: 5,
        title: "Estratégia de Scalabilidade",
        structure: [
          "Como chegar de A para B",
          "Parcerias e colaborações",
          "Tecnologia como alavanca",
        ],
      },
      {
        position: 6,
        title: "Identidade Visual Escalada",
        structure: [
          "Evolução da marca",
          "Consistência em escala",
          "Modernização mantendo essência",
        ],
      },
      {
        position: 7,
        title: "Roadmap de Expansão",
        structure: [
          "Fase de testes",
          "Escala regional",
          "Visão de longo prazo",
        ],
      },
      {
        position: 8,
        title: "Investimento em Crescimento",
        structure: [
          "Capital necessário",
          "Retorno esperado",
          "Modelos de partnership",
        ],
      },
      {
        position: 9,
        title: "Inspiração e Validação",
        structure: [
          "Exemplos de PMEs que cresceram",
          "Lições aprendidas",
          "Trajetória esperada",
        ],
      },
      {
        position: 10,
        title: "Vamos Crescer Juntos",
        structure: [
          "Começo da jornada",
          "Contato próximo",
          "Confiança e parceria",
        ],
      },
    ],
    brandkit: {
      primaryColors: ["#E67E22", "#C0392B"],
      secondaryColors: ["#27AE60", "#FFFFFF"],
      typography: {
        heading: "Ubuntu, sans-serif, 30px, bold",
        body: "Ubuntu, sans-serif, 14px, regular",
      },
      patterns: [
        "Setas de crescimento",
        "Gráficos ascendentes",
        "Mapas de expansão",
      ],
    },
  },

  6: {
    id: 6,
    name: "Storyteller Narrativo",
    positioning: {
      eixo_razao_emocao: "emocao_alta",
      eixo_maturidade: "imatura",
      target_industries: ["ONGs", "Causas sociais", "Negócios de impacto"],
      description: "Narrativa emocional focada em propósito, causa e transformação",
    },
    tone_of_voice: [
      "Inspirador",
      "Genuíno",
      "Emocional",
      "Autêntico",
      "Transformador",
    ],
    slide_structure: [
      {
        position: 1,
        title: "O Começo da História",
        structure: [
          "Momento que tudo começou",
          "Motivação profunda",
          "Conexão emocional",
        ],
      },
      {
        position: 2,
        title: "O Problema no Mundo",
        structure: [
          "Realidade dolorosa",
          "Impacto tangível",
          "Número de pessoas afetadas",
        ],
      },
      {
        position: 3,
        title: "O Chamado para Agir",
        structure: [
          "Por que isso importa agora",
          "Urgência do problema",
          "Convocação comunitária",
        ],
      },
      {
        position: 4,
        title: "A Solução Proposta",
        structure: [
          "Ideia transformadora",
          "Como resolve o problema",
          "Visão de futuro",
        ],
      },
      {
        position: 5,
        title: "Histórias de Impacto",
        structure: [
          "Vidas já transformadas",
          "Depoimentos poderosos",
          "Antes e depois",
        ],
      },
      {
        position: 6,
        title: "Como Você Pode Ajudar",
        structure: [
          "Formas de participação",
          "Voluntariado, doação, defesa",
          "Papel de cada um",
        ],
      },
      {
        position: 7,
        title: "Plano de Ação",
        structure: [
          "Etapas do projeto",
          "Timeline esperado",
          "Marcos de impacto",
        ],
      },
      {
        position: 8,
        title: "Transparência e Prestação de Contas",
        structure: [
          "Como o dinheiro é usado",
          "Resultados medidos",
          "Auditoria externa",
        ],
      },
      {
        position: 9,
        title: "Visão de Futuro",
        structure: [
          "Mundo transformado",
          "Legado esperado",
          "Convite à jornada",
        ],
      },
      {
        position: 10,
        title: "Sua Jornada Começa Aqui",
        structure: [
          "Convite à ação",
          "Formas de contribuir",
          "Comunidade que já acredita",
        ],
      },
    ],
    brandkit: {
      primaryColors: ["#E74C3C", "#C0392B"],
      secondaryColors: ["#3498DB", "#FFFFFF"],
      typography: {
        heading: "'Segoe UI', sans-serif, 32px, bold",
        body: "'Segoe UI', sans-serif, 15px, regular",
      },
      patterns: [
        "Ícones humanitários",
        "Fotos de impacto",
        "Conectores emocionais",
      ],
    },
  },

  7: {
    id: 7,
    name: "Quiet Luxury",
    positioning: {
      eixo_razao_emocao: "emocao_alta",
      eixo_maturidade: "madura",
      target_industries: ["Imóveis premium", "Luxo", "Estética e design"],
      description:
        "Minimalismo sofisticado, elegância discreta, excelência sem alarde",
    },
    tone_of_voice: [
      "Sofisticado",
      "Discreto",
      "Exclusivo",
      "Refinado",
      "Minimalista",
    ],
    slide_structure: [
      {
        position: 1,
        title: "Essência",
        structure: [
          "Marca em sua forma mais pura",
          "Design icônico",
          "Subtileza",
        ],
      },
      {
        position: 2,
        title: "Filosofia",
        structure: [
          "Princípios guia",
          "Valores atemporais",
          "Autenticidade",
        ],
      },
      {
        position: 3,
        title: "Excelência Discreta",
        structure: [
          "Qualidade inegociável",
          "Detalhes que falam",
          "Craftsmanship",
        ],
      },
      {
        position: 4,
        title: "O Cliente Ideal",
        structure: [
          "Pessoa de refinamento",
          "Conhecedor de qualidade",
          "Não precisa de ostentação",
        ],
      },
      {
        position: 5,
        title: "Estética e Design",
        structure: [
          "Paleta de cores contida",
          "Tipografia refinada",
          "Espaço em branco",
        ],
      },
      {
        position: 6,
        title: "Experiência Curada",
        structure: [
          "Jornada sensorial",
          "Cada touchpoint importa",
          "Consistência em detalhe",
        ],
      },
      {
        position: 7,
        title: "Raridade e Exclusividade",
        structure: [
          "Edições limitadas",
          "Acesso restrito",
          "Valor de scarcity",
        ],
      },
      {
        position: 8,
        title: "Investimento",
        structure: [
          "Preço reflete qualidade",
          "Apreciação ao longo do tempo",
          "Patrimônio",
        ],
      },
      {
        position: 9,
        title: "Histórias de Personalidades",
        structure: [
          "Clientes notáveis",
          "Uso discreto",
          "Recomendações de boca",
        ],
      },
      {
        position: 10,
        title: "Entre os Eleitos",
        structure: [
          "Convite exclusivo",
          "Acesso restrito",
          "Comunidade de afins",
        ],
      },
    ],
    brandkit: {
      primaryColors: ["#2C2C2C", "#000000"],
      secondaryColors: ["#D4AF37", "#FFFFFF"],
      typography: {
        heading: "Montserrat, sans-serif, 28px, light",
        body: "Montserrat, sans-serif, 12px, light",
      },
      patterns: [
        "Linha discreta",
        "Espaço em branco abundante",
        "Material photography",
      ],
    },
  },

  8: {
    id: 8,
    name: "Vanguardista",
    positioning: {
      eixo_razao_emocao: "emocao_alta",
      eixo_maturidade: "imatura",
      target_industries: ["E-sports", "Streetwear", "Gen Z"],
      description:
        "Vanguarda cultural, inovação, autenticidade de rua, disrupção criativa",
    },
    tone_of_voice: [
      "Irreverente",
      "Criativo",
      "Autêntico",
      "Vanguardista",
      "Desafiador",
    ],
    slide_structure: [
      {
        position: 1,
        title: "O Movimento",
        structure: [
          "O que estou criando",
          "Diferente de tudo que existe",
          "Posição provocadora",
        ],
      },
      {
        position: 2,
        title: "A Cultura",
        structure: [
          "O que a comunidade acredita",
          "Valores underground",
          "Movimento social",
        ],
      },
      {
        position: 3,
        title: "Rebeldia com Propósito",
        structure: [
          "O que questiono",
          "Por que essa posição",
          "Manifesto",
        ],
      },
      {
        position: 4,
        title: "Estética Futurista",
        structure: [
          "Visuais que rompem padrão",
          "Design disruptivo",
          "Cores e formas ousadas",
        ],
      },
      {
        position: 5,
        title: "Comunidade Primeiro",
        structure: [
          "Como se forma a tribu",
          "Engajamento autêntico",
          "Criadores e fãs",
        ],
      },
      {
        position: 6,
        title: "Drops e Exclusividade",
        structure: [
          "Estratégia de lançamento",
          "Escassez intencional",
          "Hype e FOMO",
        ],
      },
      {
        position: 7,
        title: "Colaborações Inesperadas",
        structure: [
          "Parcerias que surpreendem",
          "Fusão de mundos",
          "Poder da co-criação",
        ],
      },
      {
        position: 8,
        title: "Digital First",
        structure: [
          "Redes sociais como home",
          "Conteúdo nativo digital",
          "Memes e viralização",
        ],
      },
      {
        position: 9,
        title: "Influenciadores Reais",
        structure: [
          "Criadores que adotaram",
          "Uso orgânico",
          "Endosso comunitário",
        ],
      },
      {
        position: 10,
        title: "Você Faz Parte",
        structure: [
          "Seja parte do movimento",
          "Contribua à revolução",
          "Juntos somos maiores",
        ],
      },
    ],
    brandkit: {
      primaryColors: ["#FF006E", "#8338EC"],
      secondaryColors: ["#FFBE0B", "#000000"],
      typography: {
        heading: "Impact, sans-serif, 48px, bold",
        body: "Courier New, monospace, 14px, bold",
      },
      patterns: [
        "Glitch effects",
        "Graffiti elements",
        "Movimento visual",
      ],
    },
  },

  9: {
    id: 9,
    name: "Dinâmico Imersivo",
    positioning: {
      eixo_razao_emocao: "emocao_alta",
      eixo_maturidade: "madura",
      target_industries: ["UX/UI", "Apps", "Social commerce", "Vídeo"],
      description:
        "Experiência imersiva, movimento fluido, narrativa multicanal, futuro digital",
    },
    tone_of_voice: [
      "Dinâmico",
      "Imersivo",
      "Fluido",
      "Futurista",
      "Experiencial",
    ],
    slide_structure: [
      {
        position: 1,
        title: "Bem-vindo à Experiência",
        structure: [
          "Intro imersiva",
          "Movimento visual",
          "Provocação sensorial",
        ],
      },
      {
        position: 2,
        title: "O Mundo Que Criei",
        structure: [
          "Universo do produto",
          "Contexto imersivo",
          "Visão ampla",
        ],
      },
      {
        position: 3,
        title: "Interação Fluida",
        structure: [
          "Como o usuário se move",
          "Jornada intuitiva",
          "Sem fricção",
        ],
      },
      {
        position: 4,
        title: "Tecnologia Invisível",
        structure: [
          "Power behind the experience",
          "Stack técnico elegante",
          "Arquitetura que não aparece",
        ],
      },
      {
        position: 5,
        title: "Narrativa Transmídia",
        structure: [
          "História em múltiplos canais",
          "Consistência visual",
          "Experiência integrada",
        ],
      },
      {
        position: 6,
        title: "Microinterações que Delight",
        structure: [
          "Detalhe em cada clique",
          "Feedback tátil/visual",
          "Pequenas alegrias",
        ],
      },
      {
        position: 7,
        title: "Crescimento e Escala",
        structure: [
          "Roadmap de features",
          "Expansão de universo",
          "Evolução da experiência",
        ],
      },
      {
        position: 8,
        title: "Métricas de Engajamento",
        structure: [
          "Dados que importam",
          "Retenção e satisfação",
          "Indicadores de sucesso",
        ],
      },
      {
        position: 9,
        title: "Comunidade Conectada",
        structure: [
          "Usuários como coprodutores",
          "UGC e participação",
          "Rede de afins",
        ],
      },
      {
        position: 10,
        title: "Entra Agora",
        structure: [
          "Convite à jornada",
          "Acesso imediato",
          "O futuro começa aqui",
        ],
      },
    ],
    brandkit: {
      primaryColors: ["#6C5CE7", "#00B894"],
      secondaryColors: ["#FF7675", "#FFFFFF"],
      typography: {
        heading: "Inter, sans-serif, 36px, semi-bold",
        body: "Inter, sans-serif, 14px, regular",
      },
      patterns: [
        "Animações fluidas",
        "Gradientes dinâmicos",
        "Formas orgânicas",
      ],
    },
  },
};

export function getTemplate(id: number): Template | undefined {
  return TEMPLATES[id];
}

export function getAllTemplates(): Template[] {
  return Object.values(TEMPLATES);
}
