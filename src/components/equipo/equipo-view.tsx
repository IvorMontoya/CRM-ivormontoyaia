"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Trash2, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth-provider";
import { useCrm } from "@/components/crm-provider";
import type { RolMiembro } from "@/lib/crm/tipos";

const ETIQUETAS_ROL: Record<RolMiembro, string> = { admin: "Admin", miembro: "Miembro" };

export function EquipoView() {
  const { datos, acciones, miRol } = useCrm();
  const { usuario } = useAuth();
  const emailUsuario = usuario?.email?.toLowerCase() ?? "";

  const [email, setEmail] = useState("");
  const [rol, setRol] = useState<RolMiembro>("miembro");
  const [enviando, setEnviando] = useState(false);

  if (miRol !== "admin") {
    return <p className="text-sm text-muted-foreground">Solo los administradores pueden gestionar el equipo.</p>;
  }

  async function anadir(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const destino = email.trim().toLowerCase();
    if (!destino.includes("@")) {
      toast.error("Escribe un email válido");
      return;
    }
    setEnviando(true);
    try {
      await acciones.agregarMiembro(destino, rol);
      toast.success(`${destino} añadido como ${ETIQUETAS_ROL[rol].toLowerCase()}`);
      setEmail("");
      setRol("miembro");
    } catch {
      toast.error("No se pudo añadir. Revisa tu conexión y que seas admin.");
    } finally {
      setEnviando(false);
    }
  }

  async function quitar(miembro: string) {
    if (!window.confirm(`¿Quitar el acceso a ${miembro}?`)) return;
    try {
      await acciones.quitarMiembro(miembro);
      toast.success("Acceso retirado");
    } catch {
      toast.error("No se pudo quitar. Revisa tu conexión.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Equipo</h1>
        <p className="text-sm text-muted-foreground">Quién puede entrar en la agencia y con qué rol.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Miembros ({datos.miembros.length})</CardTitle>
          <CardDescription>
            Antes de añadir a alguien, crea su cuenta en la consola de Firebase con su email y pídele que verifique el
            correo al entrar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {datos.miembros.map((m) => (
            <div key={m.email} className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="truncate text-sm">{m.email}</span>
                <Badge variant={m.rol === "admin" ? "default" : "secondary"}>{ETIQUETAS_ROL[m.rol]}</Badge>
                {m.email === emailUsuario && <span className="text-xs text-muted-foreground">(tú)</span>}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0"
                disabled={m.email === emailUsuario}
                onClick={() => void quitar(m.email)}
                aria-label={`Quitar acceso a ${m.email}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Añadir miembro</CardTitle>
        </CardHeader>
        <form onSubmit={anadir}>
          <CardContent className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <div className="space-y-2">
              <Label htmlFor="equipo-email">Email</Label>
              <Input id="equipo-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="equipo-rol">Rol</Label>
              <select
                id="equipo-rol"
                value={rol}
                onChange={(e) => setRol(e.target.value as RolMiembro)}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="miembro">Miembro</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </CardContent>
          <div className="flex justify-end px-6 pb-6">
            <Button type="submit" disabled={enviando}>
              <UserPlus className="size-4" /> {enviando ? "Añadiendo..." : "Añadir"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
