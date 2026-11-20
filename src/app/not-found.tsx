import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm font-medium text-muted-foreground">Error 404</p>
      <h1 className="text-3xl font-semibold tracking-tight">Página no encontrada</h1>
      <p className="text-muted-foreground">La dirección que buscas no existe o se ha movido.</p>
      <Button nativeButton={false} render={<Link href="/" />}>Volver al inicio</Button>
    </div>
  );
}
