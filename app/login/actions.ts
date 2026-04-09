"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

// =======================
// FLUXO PRINCIPAL: LOGIN
// =======================
export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect("/login?error=true")
  }

  revalidatePath("/", "layout")
  redirect("/clientes")
}

// =======================
// FLUXO ALTERNATIVO: OAUTH
// =======================
export async function signInWithGoogle() {
  const supabase = await createClient()
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (data.url) {
    redirect(data.url)
  }
}

export async function signInWithGithub() {
  const supabase = await createClient()
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (data.url) {
    redirect(data.url)
  }
}

// =======================
// FLUXO DE RECUPERAÇÃO
// =======================
export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get("email") as string

  if (!email) {
    redirect("/login?error=no_email")
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email)
  
  if (error) {
    redirect("/login?error=reset")
  }

  redirect("/login?reset=success")
}
