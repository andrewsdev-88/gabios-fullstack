import { signup } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default async function CadastroPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams
  const checkEmail = searchParams?.success === "check_email"

  if (checkEmail) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-prisma-bg p-4 flex-col font-display">
        <div className="w-full max-w-sm mb-12 flex justify-center">
          <h2 className="text-2xl font-black tracking-tighter uppercase italic text-prisma-fg">
            G<span className="text-prisma-fg/50">GABI</span>
          </h2>
        </div>
        <div className="w-full max-w-sm p-8 bg-prisma-surface border border-prisma-accent text-center">
          <h1 className="text-2xl font-light text-prisma-fg mb-4 uppercase tracking-tight">Verificação Necessária</h1>
          <p className="text-prisma-muted text-sm mb-8">
            Verifique sua caixa de entrada (Email) e clique no link da Supabase para ativar o seu Passaporte Prisma.
          </p>
          <Link href="/login">
            <Button className="w-full">Voltar para o Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-prisma-bg p-4 flex-col font-display">
      <div className="w-full max-w-sm mb-12 flex justify-center">
        <h2 className="text-2xl font-black tracking-tighter uppercase italic text-prisma-fg">
          G<span className="text-prisma-fg/50">GABI</span>
        </h2>
      </div>

      <div className="w-full max-w-sm p-8 bg-prisma-surface border border-prisma-border">
        <h1 className="text-2xl font-light text-prisma-fg mb-2 uppercase tracking-tight">Criar Acesso Público</h1>
        <p className="text-prisma-muted text-sm mb-8">Defina seu passaporte definitivo na rede PRISMA.</p>

        {searchParams?.error === "signup_failed" && (
          <div className="mb-6 p-4 border border-red-500/50 bg-red-500/10 text-red-400 text-xs text-center uppercase tracking-widest">
            Falha no Registro. Verifique os dados.
          </div>
        )}

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-prisma-muted ml-1">
              Nome Completo
            </label>
            <Input id="nome" name="nome" type="text" placeholder="Gabi Glenda" required />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-prisma-muted ml-1">
              Email Master
            </label>
            <Input id="email" name="email" type="email" placeholder="gabi@ggabi.com" required />
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-prisma-muted ml-1">
                Criar Senha Segura
              </label>
              <Input id="password" name="password" type="password" required />
            </div>
            
            <Button formAction={signup} className="w-full mt-6 bg-prisma-fg text-prisma-surface hover:bg-white">
              CADASTRAR E ENTRAR
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-8">
        <Link href="/login" className="text-xs uppercase tracking-widest text-prisma-muted hover:text-prisma-fg transition-colors">
          ← Voltar para o Login
        </Link>
      </div>
    </div>
  )
}
