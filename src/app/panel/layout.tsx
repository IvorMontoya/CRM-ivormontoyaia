"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/components/auth-provider";
import { CrmProvider, useCrm } from "@/components/crm-provider";
import { ImportarDatosLocales } from "@/components/importar-datos-locales";
import { MigrarDatosAntiguos } from "@/components/migrar-datos-antiguos";
import { VerificarEmail } from "@/components/verificar-email";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PanelLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { usuario, cargando } = useAuth();

  // Área privada: sin sesión se vuelve al login.
  useEffect(() => {
    if (!cargando && !usuario) router.replace("/login");
  }, [cargando, usuario, router]);

  if (cargando || !usuario) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Sin email verificado no se puede entrar en la agencia: las reglas lo exigen.
  if (!usuario.emailVerified) return <VerificarEmail />;

  return (
    <CrmProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-14 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mx-2 h-4" />
            <span className="text-sm text-muted-foreground">CRM-ivormontoyaia</span>
          </header>
          <main className="flex-1 p-4 md:p-6">
            <ContenidoPanel>{children}</ContenidoPanel>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </CrmProvider>
  );
}

function ContenidoPanel({ children }: { children: ReactNode }) {
  const { cargando, sinAcceso, error } = useCrm();

  if (cargando) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (sinAcceso) {
    return (
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>No tienes acceso a esta agencia</CardTitle>
          <CardDescription>
            Pide a un administrador que te añada con tu email. Si ya te añadieron, cierra sesión y vuelve a entrar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login" className="text-sm underline">
            Volver al inicio de sesión
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return (
    <>
      <ImportarDatosLocales />
      <MigrarDatosAntiguos />
      {children}
    </>
  );
}
