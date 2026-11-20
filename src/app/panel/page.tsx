"use client";

import Link from "next/link";
import { ArrowRight, Building2, FolderKanban, MessageSquare } from "lucide-react";
import { useCrm } from "@/components/crm-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function InicioPage() {
  const { datos } = useCrm();
  const proyectosActivos = datos.proyectos.filter((p) => p.estado === "activo").length;

  const metricas = [
    { titulo: "Clientes", valor: datos.clientes.length, icono: Building2 },
    { titulo: "Proyectos activos", valor: proyectosActivos, icono: FolderKanban },
    { titulo: "Comentarios", valor: datos.comentarios.length, icono: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Inicio</h1>
        <p className="text-sm text-muted-foreground">Resumen de tu agencia.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {metricas.map((m) => (
          <Card key={m.titulo}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardDescription>{m.titulo}</CardDescription>
              <m.icono className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{m.valor}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Empieza por tus clientes</CardTitle>
          <CardDescription>
            Crea un cliente, añade sus proyectos y deja comentarios en cada uno. Los datos se guardan
            en este navegador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button nativeButton={false} render={<Link href="/panel/clientes" />}>
            Ir a Clientes <ArrowRight className="size-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
