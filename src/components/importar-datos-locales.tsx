"use client";

import { useState } from "react";
import { toast } from "sonner";
import { DatabaseZap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { useCrm } from "@/components/crm-provider";
import { leerDatosLocales, marcarDatosLocalesImportados } from "@/lib/crm/datos";

/**
 * Aviso de importación única: aparece solo si hay datos guardados en este navegador
 * por la versión anterior y todavía no se han importado.
 */
export function ImportarDatosLocales() {
  const { usuario } = useAuth();
  const { acciones } = useCrm();
  const uid = usuario?.uid ?? "";
  const [locales] = useState(() => (uid ? leerDatosLocales(uid) : null));
  const [oculto, setOculto] = useState(false);
  const [importando, setImportando] = useState(false);

  if (!locales || oculto) return null;

  async function importar() {
    if (!usuario) return;
    setImportando(true);
    try {
      const resumen = await acciones.importarLocales(locales!, usuario.email ?? "Usuario");
      marcarDatosLocalesImportados(usuario.uid);
      toast.success(
        `Importados ${resumen.clientes} clientes, ${resumen.proyectos} proyectos y ${resumen.comentarios} comentarios`,
      );
      setOculto(true);
    } catch (fallo) {
      console.error(fallo);
      toast.error("No se pudo importar. Revisa la conexión e inténtalo de nuevo.");
    } finally {
      setImportando(false);
    }
  }

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-lg border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <DatabaseZap className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
        <div className="text-sm">
          <p className="font-medium">Tienes datos guardados en este navegador</p>
          <p className="text-muted-foreground">
            Importarlos a la base de datos para verlos desde cualquier dispositivo. Los datos del navegador no se borran.
          </p>
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button variant="ghost" size="sm" onClick={() => setOculto(true)} disabled={importando}>
          Ahora no
        </Button>
        <Button size="sm" onClick={() => void importar()} disabled={importando}>
          {importando ? "Importando..." : "Importar"}
        </Button>
      </div>
    </div>
  );
}
