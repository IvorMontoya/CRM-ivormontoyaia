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
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { PESTANAS } from "@/lib/navegacion";

export function AppSidebar() {
  const pathname = usePathname();
  const { usuario, cerrarSesion } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Logo />
          <span className="font-semibold tracking-tight">CRM-ivormontoyaia</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menú</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {PESTANAS.map((pestana) => {
                const Icono = pestana.icono;
                return (
                  <SidebarMenuItem key={pestana.url}>
                    <SidebarMenuButton
                      isActive={pathname === pestana.url}
                      render={<Link href={pestana.url} />}
                    >
                      <Icono />
                      <span>{pestana.titulo}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between gap-2 px-2 py-1.5">
          <span className="truncate text-xs text-muted-foreground">{usuario?.email}</span>
          <Button variant="ghost" size="icon" onClick={() => void cerrarSesion()} aria-label="Cerrar sesión">
            <LogOut className="size-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
