"use client";

import React, { useState } from "react";

export default function ClientLeadForm() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    instagram_handle: "",
    setor: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate connection to CLIENTES table (Etapa 00)
    console.log("Submitting to CLIENTES table:", formData);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full max-w-[1440px] shadow-none bg-prisma-bg text-prisma-fg font-display min-h-[850px] overflow-hidden">
      {/* Branding Pane - PRISMA Minimalist */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-prisma-fg/10 bg-prisma-bg">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black tracking-tighter uppercase italic text-prisma-fg">
              G<span className="text-prisma-fg/50">GABI</span>
            </h2>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-black leading-[1.1] mb-6 tracking-tight text-prisma-fg">
            ETAPA 00. <br />
            <span className="italic text-prisma-fg/70">Captação de Lead.</span>
          </h1>
          <p className="text-lg text-prisma-fg/60 font-light leading-relaxed">
            Inicie sua jornada no ecossistema PRISMA. 
            Este formulário inicializa seu perfil no protocolo de diagnóstico.
          </p>
        </div>

        <div className="relative z-10 flex gap-4 items-center">
          <span className="text-sm text-prisma-fg/50">Enterprise Edition</span>
        </div>
      </div>

      {/* Form Pane */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 md:px-20 lg:px-24 bg-prisma-bg">
        <div className="lg:hidden flex items-center gap-3 mb-12">
          <h2 className="text-2xl font-black tracking-tighter uppercase italic text-prisma-fg">
            G<span className="text-prisma-fg/50">GABI</span>
          </h2>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-prisma-fg mb-2">Primeiro Contato</h2>
            <p className="text-prisma-fg/60">Preencha seus dados para conectar-se à tabela CLIENTES.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-prisma-fg ml-1 uppercase tracking-widest">Nome Completo</label>
                <div className="relative group">
                  <input
                    type="text"
                    className="w-full px-4 py-4 rounded-none bg-transparent border border-prisma-fg/20 focus:border-prisma-fg outline-none transition-all text-prisma-fg"
                    placeholder="Seu nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-prisma-fg ml-1 uppercase tracking-widest">Email Address</label>
                <div className="relative group">
                  <input
                    type="email"
                    className="w-full px-4 py-4 rounded-none bg-transparent border border-prisma-fg/20 focus:border-prisma-fg outline-none transition-all text-prisma-fg"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-prisma-fg ml-1 uppercase tracking-widest">Telefone</label>
                <div className="relative group">
                  <input
                    type="tel"
                    className="w-full px-4 py-4 rounded-none bg-transparent border border-prisma-fg/20 focus:border-prisma-fg outline-none transition-all text-prisma-fg"
                    placeholder="+55 11 90000-0000"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-prisma-fg ml-1 uppercase tracking-widest">Instagram Handle</label>
                <div className="relative group">
                  <input
                    type="text"
                    className="w-full px-4 py-4 rounded-none bg-transparent border border-prisma-fg/20 focus:border-prisma-fg outline-none transition-all text-prisma-fg"
                    placeholder="@seu.handle"
                    value={formData.instagram_handle}
                    onChange={(e) => setFormData({ ...formData, instagram_handle: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-prisma-fg ml-1 uppercase tracking-widest">Setor / Nicho</label>
                <div className="relative group">
                  <input
                    type="text"
                    className="w-full px-4 py-4 rounded-none bg-transparent border border-prisma-fg/20 focus:border-prisma-fg outline-none transition-all text-prisma-fg"
                    placeholder="Ex: Tecnologia, Consultoria, Moda"
                    value={formData.setor}
                    onChange={(e) => setFormData({ ...formData, setor: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-prisma-fg text-prisma-surface font-black uppercase tracking-widest transition-all hover:bg-white"
            >
              Confirmar Interesse
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-prisma-fg/10"></div>
            <span className="text-xs font-bold text-prisma-fg/40 uppercase tracking-widest">PRISMA System</span>
            <div className="h-[1px] flex-1 bg-prisma-fg/10"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
