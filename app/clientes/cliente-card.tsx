"use client";

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
      className="group block border border-[#1E1E1C] bg-[#0A0A08] p-6 hover:border-[#F2EDE4] transition-colors duration-300 relative"
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-xl text-[#F2EDE4] font-medium tracking-wide">
            {client.nome}
          </h3>
          {client.empresa && (
            <p className="text-[#A19D94] text-sm mt-1">{client.empresa}</p>
          )}
        </div>
        <ArrowRight className="w-5 h-5 text-[#A19D94] group-hover:text-[#F2EDE4] transition-colors -rotate-45" />
      </div>

      <div className="flex items-end justify-between border-t border-[#1E1E1C] pt-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#A19D94] mb-1">
            Status
          </p>
          <span className="flex items-center gap-2 text-sm text-[#F2EDE4]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8F23A]"></span>
            {getEtapaLabel(client.funilEtapa)}
          </span>
        </div>

        {client.segmento && (
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#A19D94] px-2 py-1 border border-[#1E1E1C]">
              {client.segmento}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
