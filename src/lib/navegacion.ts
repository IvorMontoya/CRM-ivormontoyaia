import { LayoutDashboard, Users, type LucideIcon } from "lucide-react";

export interface Pestana {
  titulo: string;
  url: string;
  icono: LucideIcon;
}

// Para añadir una pestaña nueva al menú lateral, basta con añadirla aquí
// y crear su página bajo `src/app/panel/`.
export const PESTANAS: Pestana[] = [
  { titulo: "Inicio", url: "/panel", icono: LayoutDashboard },
  { titulo: "Clientes", url: "/panel/clientes", icono: Users },
];
