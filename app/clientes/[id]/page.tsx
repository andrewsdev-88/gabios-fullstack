import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { clients } from "@/db/schema/clients";
import { idiResponses } from "@/db/schema/idi-responses";
import { eq } from "drizzle-orm";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import ProtocoloIdiForm from "./protocolo-idi-form";

export const dynamic = "force-dynamic";

export default async function ClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const [client] = await db
    .select()
    .from(clients)
    .where(eq(clients.id, id))
    .limit(1);

  if (!client) {
    redirect("/clientes");
  }

  // Fetch se já respondeu o IDI
  const [protocolo] = await db
    .select()
    .from(idiResponses)
    .where(eq(idiResponses.clientId, id))
    .limit(1);

  return (
    <div className="min-h-screen bg-[#0D0D0B] text-[#F2EDE4] p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="border-b-2 border-[#1E1E1C] pb-6">
          <Link
            href="/clientes"
            className="inline-flex items-center gap-2 text-[#A19D94] hover:text-[#F2EDE4] transition-colors mb-6 text-sm uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Operações
          </Link>
          
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-light tracking-tight">{client.nome}</h1>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-[#A19D94] text-xs uppercase tracking-[0.2em] px-2 py-1 border border-[#1E1E1C]">
                  {client.empresa || "Sem Empresa"}
                </span>
                <span className="flex items-center gap-2 text-sm text-[#F2EDE4]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8F23A]"></span>
                  Status: {client.funilEtapa}
                </span>
              </div>
            </div>
            
            {/* Pipeline progress visual PRISMA style */}
            <div className="hidden md:flex gap-2">
              {['00', '01', '02', '03', '04'].map((etapa) => {
                const isActive = client.funilEtapa === `etapa_${etapa}`;
                const isPast = client.funilEtapa > `etapa_${etapa}`;
                
                return (
                  <div 
                    key={etapa}
                    className={`h-1 w-12 rounded-full ${isActive ? 'bg-[#C8F23A]' : isPast ? 'bg-[#F2EDE4]' : 'bg-[#1E1E1C]'}`}
                  />
                );
              })}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {client.funilEtapa === "etapa_00" && !protocolo ? (
              <div className="bg-[#0A0A08] border border-[#1E1E1C] p-8">
                <div className="mb-8">
                  <h2 className="text-xl text-[#F2EDE4] font-medium tracking-wide">Protocolo IDI: Kick-off</h2>
                  <p className="text-[#A19D94] text-sm mt-2 font-light">
                    Colete as informações primárias. Ao finalizar, o cliente avança para Etapa 01.
                  </p>
                </div>
                <ProtocoloIdiForm clientId={client.id} />
              </div>
            ) : (
              <div className="bg-[#0A0A08] border border-[#1E1E1C] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="text-[#C8F23A] w-6 h-6" />
                  <h2 className="text-xl text-[#F2EDE4] font-medium tracking-wide">Protocolo Registrado</h2>
                </div>
                <div className="space-y-4">
                  <div className="border border-[#1E1E1C] p-4 text-[#A19D94] text-sm">
                    <p><strong>Aplicador:</strong> {protocolo?.aplicador}</p>
                    <p><strong>MBTI Capturado:</strong> {protocolo?.mbtiTipo}</p>
                  </div>
                  
                  <div className="pt-6">
                    <h3 className="text-lg text-[#F2EDE4] mb-2 font-medium">Próximo Passo: Vértice (Etapa 02)</h3>
                    <p className="text-[#A19D94] text-sm font-light mb-4">
                      Aguardando processamento do IDI Squad para liberação do BrandKit (BDP).
                    </p>
                    <button disabled className="px-6 py-3 bg-[#1E1E1C] text-[#A19D94] text-sm uppercase tracking-widest cursor-not-allowed">
                      Gerar BrandKit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <div className="bg-[#0A0A08] border border-[#1E1E1C] p-6">
              <h3 className="text-sm uppercase tracking-[0.2em] text-[#A19D94] mb-4">Dados do Cliente</h3>
              <ul className="space-y-3 text-sm text-[#F2EDE4] font-light">
                <li className="flex flex-col">
                  <span className="text-[#A19D94] text-xs">Segmento</span>
                  {client.segmento || "-"}
                </li>
                <li className="flex flex-col">
                  <span className="text-[#A19D94] text-xs">Instagram</span>
                  {client.instagramHandle || "-"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
