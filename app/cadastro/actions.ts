"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        nome: formData.get("nome") as string,
      }
    }
  }

  const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    console.error("Signup error:", error)
    redirect("/cadastro?error=signup_failed")
  }

  // Se a Supabase criar o usuário mas reter a sessão (padrão de segurança: Confirm Email ativado)
  if (!authData.session) {
    redirect("/cadastro?success=check_email")
  }

  revalidatePath("/", "layout")
  redirect("/clientes")
}
