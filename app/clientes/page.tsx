import { db } from "@/db/client";
import { clients, funilEtapaEnum } from "@/db/schema/clients";
import { desc } from "drizzle-orm";
import { Plus } from "lucide-react";
import ClienteCard from "./cliente-card";
import NovoClienteForm from "./novo-cliente-form";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const allClients = await db
    .select()
    .from(clients)
    .orderBy(desc(clients.createdAt));

  return (
    <div className="min-h-screen bg-[#0D0D0B] text-[#F2EDE4] p-8 font-sans selection:bg-[#C8F23A] selection:text-[#0D0D0B]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header PRISMA */}
        <header className="flex items-end justify-between border-b-2 border-[#1E1E1C] pb-6">
          <div>
            <h1 className="text-4xl font-light tracking-tight text-[#F2EDE4]">
              Clientes.
            </h1>
            <p className="text-[#A19D94] mt-2 text-sm tracking-widest uppercase">
              {allClients.length} Operações
            </p>
          </div>
          <NovoClienteForm />
        </header>

        {/* Empty State */}
        {allClients.length === 0 ? (
          <div className="text-left py-16 border-l-2 border-[#1E1E1C] pl-8">
            <h2 className="text-xl font-medium text-[#F2EDE4] mb-2">
              Nenhuma operação ativa.
            </h2>
            <p className="text-[#A19D94] font-light max-w-md">
              Inicie um novo fluxo de inteligência de marca cadastrando o primeiro cliente na base do PRISMA.
            </p>
          </div>
        ) : (
          /* Lista Grid Minimalista */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allClients.map((client) => (
              <ClienteCard key={client.id} client={client} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
