import Link from "next/link";
import {
  CircleDollarSign,
  Cpu,
  FolderKanban,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const funcionalidades = [
  {
    titulo: "Clientes y proyectos",
    descripcion: "Organiza cada cuenta con sus proyectos y su estado en un solo sitio.",
    icono: FolderKanban,
    disponible: true,
  },
  {
    titulo: "Comentarios y seguimiento",
    descripcion: "Deja notas en cada proyecto para que el equipo sepa en qué punto está.",
    icono: MessageSquare,
    disponible: true,
  },
  {
    titulo: "Facturación",
    descripcion: "Facturas a partir de horas, retainers e hitos aprobados.",
    icono: CircleDollarSign,
    disponible: false,
  },
  {
    titulo: "Costes de IA",
    descripcion: "Mide el gasto en modelos por cliente y calcula tu margen real.",
    icono: Cpu,
    disponible: false,
  },
  {
    titulo: "Seguridad con Firebase",
    descripcion: "Acceso por usuario y contraseña, con reglas de seguridad desde el diseño.",
    icono: ShieldCheck,
    disponible: true,
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <Logo />
            CRM-ivormontoyaia
          </Link>
          <Button variant="outline" nativeButton={false} render={<Link href="/login" />}>
            Entrar
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent)]"
          />
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-24 text-center sm:py-32">
            <Badge variant="secondary">Para agencias de inteligencia artificial</Badge>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Gestiona tus clientes y proyectos de IA en un solo lugar
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Clientes, proyectos y comentarios organizados en un CRM pensado para agencias de IA.
              Crece por módulos: facturación y costes de IA llegarán después.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" nativeButton={false} render={<Link href="/login" />}>
                Acceder al CRM
              </Button>
              <Button size="lg" variant="outline" nativeButton={false} render={<a href="#funcionalidades" />}>
                Ver funcionalidades
              </Button>
            </div>
          </div>
        </section>

        <section id="funcionalidades" className="mx-auto max-w-6xl px-4 pb-24">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">Funcionalidades</h2>
            <p className="mt-2 text-muted-foreground">Lo que ya está disponible y lo que viene.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {funcionalidades.map((f) => (
              <Card key={f.titulo} className="h-full">
                <CardHeader>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-muted">
                      <f.icono className="size-5" />
                    </span>
                    <Badge variant={f.disponible ? "default" : "outline"}>
                      {f.disponible ? "Disponible" : "Próximamente"}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{f.titulo}</CardTitle>
                  <CardDescription>{f.descripcion}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
          <span>CRM-ivormontoyaia</span>
          <span>Software libre bajo licencia AGPL-3.0</span>
        </div>
      </footer>
    </div>
  );
}
