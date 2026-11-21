"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { iniciales } from "@/lib/iniciales";
import { useAuth } from "@/components/auth-provider";
import { useCrm } from "@/components/crm-provider";
import { PESTANAS } from "@/lib/navegacion";

// La exportación estática usa barra final (`/panel/perfil/`); las pestañas no la llevan.
const rutaSinBarra = (ruta: string) => (ruta.length > 1 ? ruta.replace(/\/$/, "") : ruta);

export function AppSidebar() {
  const pathname = usePathname();
  const { usuario, cerrarSesion } = useAuth();
  const { miRol } = useCrm();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Logo className="group-data-[collapsible=icon]:hidden" />
          <span className="font-semibold tracking-tight group-data-[collapsible=icon]:hidden">CRM-ivormontoyaia</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menú</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {PESTANAS.filter((p) => !p.soloAdmin || miRol === "admin").map((pestana) => {
                const Icono = pestana.icono;
                return (
                  <SidebarMenuItem key={pestana.url}>
                    <SidebarMenuButton
                      isActive={rutaSinBarra(pathname) === pestana.url}
                      tooltip={pestana.titulo}
                      render={<Link href={pestana.url} />}
                      className="border border-sidebar-border transition-colors hover:border-foreground/50 hover:bg-foreground/10 data-active:border-foreground/50 data-active:bg-foreground/10"
                    >
                      <Icono />
                      <span className="group-data-[collapsible=icon]:hidden">{pestana.titulo}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-3 rounded-lg border bg-sidebar-accent/40 p-2 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
          <Avatar className="size-9 rounded-lg">
            {usuario?.photoURL && <AvatarImage src={usuario.photoURL} alt="" />}
            <AvatarFallback className="rounded-lg bg-primary text-xs font-medium text-primary-foreground">
              {iniciales(usuario?.displayName, usuario?.email)}
            </AvatarFallback>
          </Avatar>
          <Link href="/panel/perfil" className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-medium">{usuario?.displayName || "Mi perfil"}</p>
            <p className="truncate text-xs text-muted-foreground">{usuario?.email}</p>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="group-data-[collapsible=icon]:hidden"
            onClick={() => void cerrarSesion()}
            aria-label="Cerrar sesión"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
