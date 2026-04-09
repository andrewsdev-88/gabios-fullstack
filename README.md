# gabiOS — ERP de Inteligência de Marca & PRISMA 

O **gabiOS** é o sistema central e a espinha dorsal de operações da agência **G Gabi Produções**. Ele digitaliza o ecossistema estratégico de Branding, Direção de Arte e Criação de Conteúdo da agência sob a metodologia e funil estrito do **PRISMA**.

---

## 🏛️ O que realizamos até agora (State of the Union)

### 1. Arquitetura de Dados (Database) Suprema
Sistematizamos o modelo de negócios da G Gabi Produções em um banco de dados **PostgreSQL** ultra-robusto usando **Drizzle ORM**.
- **`clients`**: Hub mestre do funil e jornada PRISMA (Etapas 00 à 05).
- **`idi_responses`**: Diagnóstico psicológico/comportamental, armazenando respostas textuais para orquestração da inteligência artificial (IDI Squad).
- **`brandkits`**: Gestão do Brand Direction Protocol (BDP), armazenando tokens visuais, tipografias e ativos-chaves (Logos em base64).
- **`studio_execucoes`**: O núcleo de **Routing** da agência operando os 5 Studios de arte e copy de maneira estrita.
- **🛡️ Hard Constraints no Banco:** Implementamos Triggers SQL diretos para realizar blindagem de arquitetura. Por exemplo, a esteira *jamais* avança para execução avançada de Studio se o Client BDP ou Logomarca não estiverem expressamente aprovados ("Glenda_Check").

### 2. UI/UX: Design System Blindado (PRISMA Check)
Assumimos todos os legados anteriores (criados com assistentes como Stitch) e realizamos uma **Filtragem Implacável**:
- Substituímos todos os clichês de SaaS corporativos genéricos (bordas ultra-arredondadas, drop-shadows cafonas e escalas de cinza sem personalidade).
- A interface oficial foi ancorada na identidade *Premium Minimal*: **Preto (#0D0D0B)** e **Off-white (#F2EDE4)** com acentos pontuais agressivos **Lime (#C8F23A)**.
- O Frontend foi refatorado adotando **Next.js 15 (App Router)** via paradigmas modernos de **React Server Components** e **Server Actions**, removendo instabilidades client-side.

### 3. Frontend Automation (HTML Canvas Squad)
Desenvolvemos um asset primário inestimável: o **Canvas Template Master**. Todo o motor visual de background e safe zones que o `gabiOS` usará para injetar programaticamente a _Copy Forense_ em cartelas de render final já opera localmente, protegido por restrições inegociáveis de design (nada sai fora das Safe Zones).

### 4. Resolução de Ambiente e Acessibilidade (MCP Tools)
- Fixamos a herança global e interprocessos de binários chaves (Symlinks absolutos de `npx` e `node`) de forma que IDEs autônomas (via MCP) possam ler, iterar e conectar-se à shell de desenvolvimento desabilitando bloqueadores de PATH.

---

## 🚀 Onde estamos atuando agora (Next Steps In-flight)

1. **Ativação Autônoma de Geração de Componentes e Pipelines:** 
   O foco vigente é fechar os roteadores do BDP e do Protocolo IDI. Já refatoramos o pipeline interno em `/app/clientes/` para exibir corretamente o diagnóstico.
2. **Sincronia do Stitch MCP:** 
   Agora que a infraestrutura da máquina foi saneada (Npx atrelado localmente), o objetivo é fazer as chamadas locais ativas do **Stitch MCP** para criar os cartões visuais dos clientes, gerenciar layouts adicionais sob orquestração de Agentes IA (Baton passing programado).
3. **Esteira de Produção de Conteúdo:**
   Construir a camada visual atrelada a tabelas `content-cycles` e `content-assets` usando o recém montado layout "PRISMA Check".

---

> **Mantra gabiOS:** "A arquitetura e os dados protegem o design, e o design eleva as autoridades." – Arquiteto Central.
