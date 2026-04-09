"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { clients, funilEtapaEnum } from "@/db/schema/clients";
import { idiResponses } from "@/db/schema/idi-responses";

export async function createClientAction(formData: FormData) {
  const nome = formData.get("nome") as string;
  const empresa = formData.get("empresa") as string;
  const segmento = formData.get("segmento") as string;

  if (!nome) return;

  await db.insert(clients).values({
    nome,
    empresa: empresa || null,
    segmento: segmento || null,
    funilEtapa: "etapa_00",
  });

  revalidatePath("/clientes");
}

export async function salvarProtocoloIdiAction(clientId: string, formData: FormData) {
  const aplicador = formData.get("aplicador") as string;
  const mbtiTipo = formData.get("mbtiTipo") as string;
  
  // Insert protocol
  await db.insert(idiResponses).values({
    clientId,
    aplicador: aplicador || "Glenda",
    mbtiTipo: mbtiTipo || "Não definido",
  });

  // Advance funil to etapa_01
  await db
    .update(clients)
    .set({ funilEtapa: "etapa_01" })
    .where(clients.id.equals(clientId));

  revalidatePath(`/clientes/${clientId}`);
}
