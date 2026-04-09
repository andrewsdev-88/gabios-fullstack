"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { createClientAction } from "./actions";

export default function NovoClienteForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    await createClientAction(formData);
    setIsOpen(false);
    setIsSubmitting(false);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 border border-[#1E1E1C] hover:border-[#F2EDE4] text-[#F2EDE4] transition-colors text-sm uppercase tracking-widest"
      >
        <Plus className="w-4 h-4" />
        Novo Integrante
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-[#0A0A08]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D0D0B] border border-[#1E1E1C] w-full max-w-md p-8 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-[#A19D94] hover:text-[#F2EDE4] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-light text-[#F2EDE4] mb-8">
              Novo Cliente
            </h2>

            <form action={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#A19D94] mb-2">
                  Nome do Cliente / Autoridade *
                </label>
                <input
                  type="text"
                  name="nome"
                  required
                  autoFocus
                  className="w-full bg-[#0A0A08] border border-[#1E1E1C] px-4 py-3 text-[#F2EDE4] placeholder-[#1E1E1C] focus:outline-none focus:border-[#C8F23A] transition-colors"
                  placeholder="Ex: Glenda Gabi"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#A19D94] mb-2">
                  Empresa / Projeto
                </label>
                <input
                  type="text"
                  name="empresa"
                  className="w-full bg-[#0A0A08] border border-[#1E1E1C] px-4 py-3 text-[#F2EDE4] placeholder-[#1E1E1C] focus:outline-none focus:border-[#C8F23A] transition-colors"
                  placeholder="Ex: G Gabi Produções"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#A19D94] mb-2">
                  Segmento
                </label>
                <input
                  type="text"
                  name="segmento"
                  className="w-full bg-[#0A0A08] border border-[#1E1E1C] px-4 py-3 text-[#F2EDE4] placeholder-[#1E1E1C] focus:outline-none focus:border-[#C8F23A] transition-colors"
                  placeholder="Ex: Consultoria / Moda / Tech"
                />
              </div>

              <div className="pt-4 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 text-sm text-[#A19D94] hover:text-[#F2EDE4] uppercase tracking-widest transition-colors"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#C8F23A] text-[#0A0A08] hover:bg-[#F2EDE4] text-sm uppercase tracking-widest transition-colors font-medium disabled:opacity-50"
                >
                  {isSubmitting ? "Criando..." : "Registrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
