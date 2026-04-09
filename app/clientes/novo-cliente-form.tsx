"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { createClientAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Integrante
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-4">Novo Cliente</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-prisma-muted mb-2">
              Nome do Cliente / Autoridade *
            </label>
            <Input
              type="text"
              name="nome"
              required
              autoFocus
              placeholder="Ex: Glenda Gabi"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-prisma-muted mb-2">
              Empresa / Projeto
            </label>
            <Input
              type="text"
              name="empresa"
              placeholder="Ex: G Gabi Produções"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-prisma-muted mb-2">
              Segmento
            </label>
            <Input
              type="text"
              name="segmento"
              placeholder="Ex: Consultoria / Moda / Tech"
            />
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Criando..." : "Registrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
