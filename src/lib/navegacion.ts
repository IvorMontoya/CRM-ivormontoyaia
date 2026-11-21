import { LayoutDashboard, Target, User, Users, ShieldCheck, type LucideIcon } from "lucide-react";

export interface Pestana {
  titulo: string;
  url: string;
  icono: LucideIcon;
  /** Solo se muestra a los administradores de la agencia. */
  soloAdmin?: boolean;
}

// Para añadir una pestaña nueva al menú lateral, basta con añadirla aquí
// y crear su página bajo `src/app/panel/`.
export const PESTANAS: Pestana[] = [
  { titulo: "Inicio", url: "/panel", icono: LayoutDashboard },
  { titulo: "Leads", url: "/panel/leads", icono: Target },
  { titulo: "Clientes", url: "/panel/clientes", icono: Users },
  { titulo: "Equipo", url: "/panel/equipo", icono: ShieldCheck, soloAdmin: true },
  { titulo: "Mi perfil", url: "/panel/perfil", icono: User },
];
