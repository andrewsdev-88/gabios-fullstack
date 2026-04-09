import Link from "next/link";
import { type Client } from "@/db/schema/clients";
import { ArrowRight } from "lucide-react";

export default function ClienteCard({ client }: { client: Client }) {
  const getEtapaLabel = (etapa: string) => {
    const labels: Record<string, string> = {
      etapa_00: "00 / Captação",
      etapa_01: "01 / Protocolo IDI",
      etapa_02: "02 / Vértice",
      etapa_03: "03 / BrandKit BDP",
      etapa_04: "04 / Produção",
      etapa_05: "05 / Encerramento",
    };
    return labels[etapa] || etapa;
  };

  return (
    <Link
      href={`/clientes/${client.id}`}
      className="group block border border-prisma-border bg-prisma-surface p-6 hover:border-prisma-fg transition-colors duration-300 relative"
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-xl text-prisma-fg font-medium tracking-wide">
            {client.nome}
          </h3>
          {client.empresa && (
            <p className="text-prisma-muted text-sm mt-1">{client.empresa}</p>
          )}
        </div>
        <ArrowRight className="w-5 h-5 text-prisma-muted group-hover:text-prisma-fg transition-colors -rotate-45" />
      </div>

      <div className="flex items-end justify-between border-t border-prisma-border pt-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-prisma-muted mb-1">
            Status
          </p>
          <span className="flex items-center gap-2 text-sm text-prisma-fg">
            <span className="w-1.5 h-1.5 rounded-full bg-prisma-accent"></span>
            {getEtapaLabel(client.funilEtapa)}
          </span>
        </div>

        {client.segmento && (
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-[0.2em] text-prisma-muted px-2 py-1 border border-prisma-border">
              {client.segmento}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
