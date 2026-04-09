import { login, signInWithGoogle, signInWithGithub, resetPassword } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-prisma-bg p-4 flex-col font-display">
      <div className="w-full max-w-sm mb-12 flex justify-center">
        <h2 className="text-2xl font-black tracking-tighter uppercase italic text-prisma-fg">
          G<span className="text-prisma-fg/50">GABI</span>
        </h2>
      </div>

      <div className="w-full max-w-sm p-8 bg-prisma-surface border border-prisma-border">
        <h1 className="text-2xl font-light text-prisma-fg mb-2 uppercase tracking-tight">Access Node</h1>
        <p className="text-prisma-muted text-sm mb-8">Credenciais necessárias para entrar na rede PRISMA.</p>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-prisma-muted ml-1">
              Email
            </label>
            <Input id="email" name="email" type="email" placeholder="gabi@ggabi.com" required />
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center w-full">
                <label className="text-[10px] font-bold uppercase tracking-widest text-prisma-muted ml-1">
                  Password
                </label>
                <button formAction={resetPassword} className="text-[10px] text-prisma-muted hover:text-prisma-fg uppercase tracking-widest transition-colors mb-1">
                  Resetar?
                </button>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
            
            <div className="pt-2">
              <Button formAction={login} className="w-full">
                Authenticate
              </Button>
            </div>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-prisma-fg/10" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
              <span className="bg-prisma-surface px-2 text-prisma-muted">Ou métodos alternativos</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button formAction={signInWithGoogle} variant="outline" className="w-full text-xs">
              Google
            </Button>
            <Button formAction={signInWithGithub} variant="outline" className="w-full text-xs">
              GitHub
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-8 flex flex-col items-center gap-6 w-full max-w-sm">
        <Link href="/cadastro" className="text-xs uppercase tracking-widest text-prisma-fg border-b border-prisma-fg/20 hover:border-prisma-accent hover:text-prisma-accent pb-1 transition-colors">
          Não tem passaporte? Registe-se
        </Link>
        <div className="flex w-full items-center gap-4">
            <div className="h-[1px] flex-1 bg-prisma-fg/10"></div>
            <span className="text-[10px] font-bold text-prisma-fg/40 uppercase tracking-widest">PRISMA Identity</span>
            <div className="h-[1px] flex-1 bg-prisma-fg/10"></div>
        </div>
      </div>
    </div>
  )
}
