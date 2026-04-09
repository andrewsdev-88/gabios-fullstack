"use client";

import React, { useState } from "react";

export default function BrandKitForm() {
  const [formData, setFormData] = useState({
    cor_background: "#0D0D0B",
    cor_primaria: "#F2EDE4",
    font_display: "Syne",
    font_corpo: "DM Sans",
    restrictions: "",
    logo_direction: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate connection to BRANDKITS table (Etapa 02)
    console.log("Submitting to BRANDKITS table:", formData);
  };

  return (
    <div className="w-full mx-auto bg-prisma-bg text-prisma-fg font-body min-h-screen p-6 lg:p-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-12 border-b border-prisma-fg/10 pb-8">
          <span className="inline-block px-3 py-1 border border-prisma-fg/20 text-prisma-fg/60 text-[10px] font-bold uppercase tracking-widest mb-4">
            Etapa 02
          </span>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 font-display">
            Brand Kit & Settings
          </h1>
          <p className="text-prisma-fg/60 text-lg max-w-2xl">
            Configure seu Brand Data Package (BDP). Estes dados geram a identidade visual
            que alimenta os Studios Automatizados de conteúdo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* Colors */}
            <div className="bg-transparent p-8 border border-prisma-fg/20 shadow-none">
              <div className="flex items-center gap-3 mb-6 border-b border-prisma-fg/10 pb-4">
                <h3 className="text-xl font-bold uppercase tracking-widest">Arquitetura Cromática</h3>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-prisma-fg/60">Cor Background</label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 border border-prisma-fg/20" style={{ backgroundColor: formData.cor_background }}></div>
                      <input
                        type="text"
                        className="flex-1 px-4 py-3 bg-transparent border border-prisma-fg/20 focus:border-prisma-fg outline-none transition-all uppercase text-sm font-mono"
                        value={formData.cor_background}
                        onChange={(e) => setFormData({ ...formData, cor_background: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-prisma-fg/60">Cor Primária</label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 border border-prisma-fg/20" style={{ backgroundColor: formData.cor_primaria }}></div>
                      <input
                        type="text"
                        className="flex-1 px-4 py-3 bg-transparent border border-prisma-fg/20 focus:border-prisma-fg outline-none transition-all uppercase text-sm font-mono"
                        value={formData.cor_primaria}
                        onChange={(e) => setFormData({ ...formData, cor_primaria: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="bg-transparent p-8 border border-prisma-fg/20 shadow-none">
              <div className="flex items-center gap-3 mb-6 border-b border-prisma-fg/10 pb-4">
                <h3 className="text-xl font-bold uppercase tracking-widest">Tipografia</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-prisma-fg/60">Font Display (Títulos)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-transparent border border-prisma-fg/20 focus:border-prisma-fg outline-none transition-all"
                      value={formData.font_display}
                      onChange={(e) => setFormData({ ...formData, font_display: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-prisma-fg/60">Font Corpo (Textos)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-transparent border border-prisma-fg/20 focus:border-prisma-fg outline-none transition-all"
                      value={formData.font_corpo}
                      onChange={(e) => setFormData({ ...formData, font_corpo: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Instructions */}
            <div className="col-span-1 xl:col-span-2 bg-transparent p-8 border border-prisma-fg/20 shadow-none">
              <div className="flex items-center justify-between mb-8 border-b border-prisma-fg/10 pb-4">
                <h3 className="text-xl font-bold uppercase tracking-widest">Diretrizes da Marca</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-prisma-fg/60">Restrições (O que a marca rejeita)</label>
                  <textarea
                    className="w-full px-4 py-3 bg-transparent border border-prisma-fg/20 focus:border-prisma-fg outline-none transition-all min-h-[100px]"
                    placeholder="Ex: Não usar fotos de banco de imagens, sem filtros excessivos..."
                    value={formData.restrictions}
                    onChange={(e) => setFormData({ ...formData, restrictions: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-prisma-fg/60">Direção da Logo</label>
                  <textarea
                    className="w-full px-4 py-3 bg-transparent border border-prisma-fg/20 focus:border-prisma-fg outline-none transition-all min-h-[100px]"
                    placeholder="Ex: Tipografia forte, minimalista, uso de monograma..."
                    value={formData.logo_direction}
                    onChange={(e) => setFormData({ ...formData, logo_direction: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-end gap-4 border-t border-prisma-fg/10 pt-8">
            <button
              type="submit"
              className="px-12 py-4 bg-prisma-fg text-prisma-surface font-black uppercase tracking-widest transition-all hover:bg-white"
            >
              Salvar Brand Kit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
