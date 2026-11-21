"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { useCrm } from "@/components/crm-provider";
import { migrarDesdeUsuario } from "@/lib/crm/repositorio";

/**
 * Aviso de copia única para el admin: pasa los datos de la versión anterior
 * (`usuarios/{uid}`) a la agencia compartida. No borra el original.
 */
export function MigrarDatosAntiguos() {
  const { usuario } = useAuth();
  const { miRol } = useCrm();
  const uid = usuario?.uid ?? "";
  const clave = `crm-migrado-agencia:${uid}`;
  const [oculto, setOculto] = useState(() => {
    try {
      return !uid || window.localStorage.getItem(clave) !== null;
    } catch {
      return true;
    }
  });
  const [copiando, setCopiando] = useState(false);

  if (miRol !== "admin" || oculto) return null;

  async function copiar() {
    setCopiando(true);
    try {
      const resumen = await migrarDesdeUsuario(uid);
      try {
        window.localStorage.setItem(clave, new Date().toISOString());
      } catch {
        // Sin almacenamiento, el aviso podría volver a aparecer; la copia es idempotente.
      }
      toast.success(
        `Copiados ${resumen.clientes} clientes, ${resumen.proyectos} proyectos y ${resumen.comentarios} comentarios`,
      );
      setOculto(true);
    } catch (fallo) {
      console.error(fallo);
      toast.error("No se pudo copiar. Revisa la conexión e inténtalo de nuevo.");
    } finally {
      setCopiando(false);
    }
  }

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-lg border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <Database className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
        <div className="text-sm">
          <p className="font-medium">Copia tus datos anteriores a la agencia</p>
          <p className="text-muted-foreground">
            Los clientes y proyectos que creaste antes pasarán a la agencia compartida, para que el equipo los vea.
            Tus datos originales no se borran.
          </p>
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button variant="ghost" size="sm" onClick={() => setOculto(true)} disabled={copiando}>
          Ahora no
        </Button>
        <Button size="sm" onClick={() => void copiar()} disabled={copiando}>
          {copiando ? "Copiando..." : "Copiar"}
        </Button>
      </div>
    </div>
  );
}
