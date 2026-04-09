import { login } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
              <label className="text-[10px] font-bold uppercase tracking-widest text-prisma-muted ml-1">
                Password
              </label>
              <Input id="password" name="password" type="password" required />
            </div>
            
            <Button formAction={login} className="w-full mt-4">
              Authenticate
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-12 flex items-center gap-4 w-full max-w-sm">
        <div className="h-[1px] flex-1 bg-prisma-fg/10"></div>
        <span className="text-[10px] font-bold text-prisma-fg/40 uppercase tracking-widest">PRISMA Identity</span>
        <div className="h-[1px] flex-1 bg-prisma-fg/10"></div>
      </div>
    </div>
  )
}
