"use client";

import { useState } from "react";
import { salvarProtocoloIdiAction } from "../actions";

export default function ProtocoloIdiForm({ clientId }: { clientId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    await salvarProtocoloIdiAction(clientId, formData);
    setIsSubmitting(false);
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-[#A19D94] mb-2">
            Aplicador
          </label>
          <input
            type="text"
            name="aplicador"
            required
            className="w-full bg-[#0D0D0B] border border-[#1E1E1C] px-4 py-3 text-[#F2EDE4] placeholder-[#1E1E1C] focus:outline-none focus:border-[#C8F23A] transition-colors"
            placeholder="Nome de quem aplicou"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-[#A19D94] mb-2">
            Diagnóstico MBTI Preliminar
          </label>
          <select
            name="mbtiTipo"
            className="w-full bg-[#0D0D0B] border border-[#1E1E1C] px-4 py-3 text-[#F2EDE4] focus:outline-none focus:border-[#C8F23A] transition-colors appearance-none"
          >
            <option value="ENFJ">ENFJ - Protagonista</option>
            <option value="ENTJ">ENTJ - Comandante</option>
            <option value="INTJ">INTJ - Arquiteto</option>
            <option value="INTP">INTP - Lógico</option>
            <option value="Outro">Outro (será definido pelo Squad)</option>
          </select>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-4 bg-[#C8F23A] text-[#0A0A08] hover:bg-[#F2EDE4] text-sm uppercase tracking-widest transition-colors font-medium disabled:opacity-50"
        >
          {isSubmitting ? "Processando..." : "Registrar Protocolo (Avançar Etapa 01)"}
        </button>
      </div>
    </form>
  );
}
