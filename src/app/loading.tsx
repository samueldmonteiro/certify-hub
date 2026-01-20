import { Loader2 } from 'lucide-react';

export default async function Loading() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-6 p-8 animate-in fade-in zoom-in duration-300">
        <div className="relative flex h-24 w-24 items-center justify-center shadow-2xl shadow-orange-500/10 rounded-full bg-card/50 border border-border/50 backdrop-blur-sm">
          <div className="absolute inset-0 rounded-full border-4 border-orange-600/20" />
          <div className="absolute inset-0 rounded-full border-t-4 border-orange-600 animate-spin" />
          <Loader2 className="h-10 w-10 text-orange-600 animate-pulse" />
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Carregando...
          </h2>
          <p className="text-sm text-muted-foreground animate-pulse">
            Preparando seus certificados
          </p>
        </div>
      </div>
    </div>
  );
}
