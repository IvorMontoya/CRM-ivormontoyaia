"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { cargarDatos, guardarDatos } from "@/lib/crm/datos";
import type { DatosCrm } from "@/lib/crm/tipos";

interface CrmContextValue {
  datos: DatosCrm;
  actualizar: (cambio: (actuales: DatosCrm) => DatosCrm) => void;
}

const CrmContext = createContext<CrmContextValue | null>(null);

/**
 * Carga los datos del usuario desde el navegador y los guarda en cada cambio.
 * Debe montarse solo cuando el usuario ya ha iniciado sesión (ver `panel/layout.tsx`).
 */
export function CrmProvider({ uid, children }: { uid: string; children: ReactNode }) {
  const [datos, setDatos] = useState<DatosCrm>(() => cargarDatos(uid));

  useEffect(() => {
    guardarDatos(uid, datos);
  }, [uid, datos]);

  const actualizar = (cambio: (actuales: DatosCrm) => DatosCrm) => setDatos((prev) => cambio(prev));

  return <CrmContext.Provider value={{ datos, actualizar }}>{children}</CrmContext.Provider>;
}

export function useCrm(): CrmContextValue {
  const contexto = useContext(CrmContext);
  if (!contexto) throw new Error("useCrm debe usarse dentro de CrmProvider");
  return contexto;
}
