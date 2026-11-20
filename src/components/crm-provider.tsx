"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as repo from "@/lib/crm/repositorio";
import {
  datosVacios,
  type CamposCliente,
  type CamposProyecto,
  type DatosCrm,
  type EstadoProyecto,
} from "@/lib/crm/tipos";

/** Acciones de escritura. Devuelven promesas que se rechazan si Firestore no acepta el cambio. */
export interface AccionesCrm {
  crearCliente: (campos: CamposCliente) => Promise<void>;
  eliminarCliente: (clienteId: string) => Promise<void>;
  crearProyecto: (campos: CamposProyecto) => Promise<void>;
  cambiarEstadoProyecto: (proyectoId: string, estado: EstadoProyecto) => Promise<void>;
  eliminarProyecto: (proyectoId: string) => Promise<void>;
  crearComentario: (proyectoId: string, texto: string, autor: string) => Promise<void>;
  eliminarComentario: (comentarioId: string) => Promise<void>;
  importarLocales: (locales: DatosCrm, autor: string) => Promise<{ clientes: number; proyectos: number; comentarios: number }>;
}

interface CrmContextValue {
  datos: DatosCrm;
  cargando: boolean;
  error: string | null;
  acciones: AccionesCrm;
}

const CrmContext = createContext<CrmContextValue | null>(null);

/**
 * Escucha en tiempo real los datos del usuario en Firestore.
 * Debe montarse solo cuando el usuario ya ha iniciado sesión (ver `panel/layout.tsx`).
 */
export function CrmProvider({ uid, children }: { uid: string; children: ReactNode }) {
  const [datos, setDatos] = useState<DatosCrm>(datosVacios);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(
    () =>
      repo.suscribirDatos(
        uid,
        (nuevos) => {
          setDatos(nuevos);
          setCargando(false);
          setError(null);
        },
        (fallo) => {
          console.error(fallo);
          setError("No se pueden leer los datos. Revisa la conexión y tus permisos.");
          setCargando(false);
        },
      ),
    [uid],
  );

  const acciones: AccionesCrm = {
    crearCliente: (campos) => repo.crearCliente(uid, campos),
    eliminarCliente: (clienteId) => repo.eliminarCliente(uid, datos, clienteId),
    crearProyecto: (campos) => repo.crearProyecto(uid, campos),
    cambiarEstadoProyecto: (proyectoId, estado) => repo.actualizarEstadoProyecto(uid, proyectoId, estado),
    eliminarProyecto: (proyectoId) => repo.eliminarProyecto(uid, datos, proyectoId),
    crearComentario: (proyectoId, texto, autor) => repo.crearComentario(uid, proyectoId, texto, autor),
    eliminarComentario: (comentarioId) => repo.eliminarComentario(uid, comentarioId),
    importarLocales: (locales, autor) => repo.importarDatosLocales(uid, locales, autor),
  };

  return (
    <CrmContext.Provider value={{ datos, cargando, error, acciones }}>{children}</CrmContext.Provider>
  );
}

export function useCrm(): CrmContextValue {
  const contexto = useContext(CrmContext);
  if (!contexto) throw new Error("useCrm debe usarse dentro de CrmProvider");
  return contexto;
}
