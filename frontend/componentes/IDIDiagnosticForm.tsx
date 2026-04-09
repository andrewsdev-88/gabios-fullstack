"use client";

import React, { useState } from "react";

export default function IDIDiagnosticForm() {
  const [formData, setFormData] = useState({
    mbti_tipo: "INTJ",
    ritmo_trabalho: "",
    nicho_mercado: "",
    dor_principal: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate connection to PROTOCOLO IDI table (Etapa 01)
    console.log("Submitting to PROTOCOLO IDI table:", formData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 lg:p-12 bg-[#0D0D0B] text-[#F2EDE4] font-display min-h-screen">
      <div className="mb-12 border-b border-[#F2EDE4]/10 pb-8">
        <span className="inline-block px-3 py-1 border border-[#F2EDE4]/20 text-[#F2EDE4]/60 text-[10px] font-bold uppercase tracking-widest mb-4">
          Etapa 01
        </span>
        <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4">
          Diagnóstico IDI
        </h1>
        <p className="text-[#F2EDE4]/60 text-lg max-w-2xl">
          Instruções de formulário do protocolo de Investigação de Identidade.
          Estes dados alimentam a tabela idi_responses do ecossistema.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Bloco 1 - MBTI e Cognição */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-widest border-b border-[#F2EDE4]/10 pb-2">
             Bloco 1 — MBTI e Cognição
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#F2EDE4]/60">MBTI Tipo</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-transparent border border-[#F2EDE4]/20 focus:border-[#F2EDE4] outline-none transition-all uppercase"
                value={formData.mbti_tipo}
                onChange={(e) => setFormData({ ...formData, mbti_tipo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#F2EDE4]/60">Ritmo de Trabalho</label>
              <select
                className="w-full px-4 py-3 bg-transparent border border-[#F2EDE4]/20 focus:border-[#F2EDE4] outline-none transition-all appearance-none rounded-none"
                value={formData.ritmo_trabalho}
                onChange={(e) => setFormData({ ...formData, ritmo_trabalho: e.target.value })}
              >
                <option value="" className="bg-[#0D0D0B] text-[#F2EDE4]">Selecione...</option>
                <option value="Acelerado" className="bg-[#0D0D0B] text-[#F2EDE4]">Acelerado / Batching</option>
                <option value="Constante" className="bg-[#0D0D0B] text-[#F2EDE4]">Constante / Metódico</option>
                <option value="Fluxo" className="bg-[#0D0D0B] text-[#F2EDE4]">Por fluxo / Inspiração</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bloco 6 - Contexto Operacional */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-widest border-b border-[#F2EDE4]/10 pb-2">
             Bloco 6 — Contexto Operacional
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#F2EDE4]/60">Nicho de Mercado</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-transparent border border-[#F2EDE4]/20 focus:border-[#F2EDE4] outline-none transition-all"
                value={formData.nicho_mercado}
                onChange={(e) => setFormData({ ...formData, nicho_mercado: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#F2EDE4]/60">Dor Principal do Cliente</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-transparent border border-[#F2EDE4]/20 focus:border-[#F2EDE4] outline-none transition-all"
                value={formData.dor_principal}
                onChange={(e) => setFormData({ ...formData, dor_principal: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="pt-8">
          <button
            type="submit"
            className="w-full md:w-auto px-12 py-4 bg-[#F2EDE4] text-[#0D0D0B] font-black uppercase tracking-widest transition-all hover:bg-white"
          >
            Gerar Dossiê IDI
          </button>
        </div>
      </form>
    </div>
  );
}
