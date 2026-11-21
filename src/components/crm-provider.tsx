"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { FirebaseError } from "firebase/app";
import { useAuth } from "@/components/auth-provider";
import * as repo from "@/lib/crm/repositorio";
import {
  datosVacios,
  type CamposCliente,
  type CamposLead,
  type CamposProyecto,
  type DatosCrm,
  type DatosLocales,
  type EstadoProyecto,
  type EtapaLead,
  type Lead,
  type RolMiembro,
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
  importarLocales: (
    locales: DatosLocales,
    autor: string,
  ) => Promise<{ clientes: number; proyectos: number; comentarios: number }>;
  crearLead: (campos: CamposLead) => Promise<void>;
  actualizarLead: (leadId: string, campos: CamposLead) => Promise<void>;
  cambiarEtapaLead: (leadId: string, etapa: EtapaLead) => Promise<void>;
  eliminarLead: (leadId: string) => Promise<void>;
  convertirLeadEnCliente: (lead: Lead) => Promise<void>;
  agregarMiembro: (email: string, rol: RolMiembro) => Promise<void>;
  quitarMiembro: (email: string) => Promise<void>;
}

interface CrmContextValue {
  datos: DatosCrm;
  cargando: boolean;
  /** `true` si las reglas deniegan el acceso: no eres miembro de la agencia o no has verificado el email. */
  sinAcceso: boolean;
  error: string | null;
  /** Rol del usuario actual en la agencia, o `null` si no es miembro. */
  miRol: RolMiembro | null;
  acciones: AccionesCrm;
}

const CrmContext = createContext<CrmContextValue | null>(null);

/**
 * Escucha en tiempo real los datos compartidos de la agencia en Firestore.
 * Debe montarse solo cuando el usuario ya ha iniciado sesión (ver `panel/layout.tsx`).
 */
export function CrmProvider({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  const [datos, setDatos] = useState<DatosCrm>(datosVacios);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sinAcceso, setSinAcceso] = useState(false);

  useEffect(
    () =>
      repo.suscribirDatos(
        (nuevos) => {
          setDatos(nuevos);
          setCargando(false);
          setError(null);
          setSinAcceso(false);
        },
        (fallo) => {
          console.error(fallo);
          const denegado = fallo instanceof FirebaseError && fallo.code === "permission-denied";
          setSinAcceso(denegado);
          setError(
            denegado
              ? "No tienes acceso a esta agencia."
              : "No se pueden leer los datos. Revisa la conexión e inténtalo de nuevo.",
          );
          setCargando(false);
        },
      ),
    [],
  );

  const emailUsuario = usuario?.email?.toLowerCase() ?? null;
  const miRol = emailUsuario ? (datos.miembros.find((m) => m.email === emailUsuario)?.rol ?? null) : null;

  const acciones: AccionesCrm = {
    crearCliente: (campos) => repo.crearCliente(campos),
    eliminarCliente: (clienteId) => repo.eliminarCliente(datos, clienteId),
    crearProyecto: (campos) => repo.crearProyecto(campos),
    cambiarEstadoProyecto: (proyectoId, estado) => repo.actualizarEstadoProyecto(proyectoId, estado),
    eliminarProyecto: (proyectoId) => repo.eliminarProyecto(datos, proyectoId),
    crearComentario: (proyectoId, texto, autor) => repo.crearComentario(proyectoId, texto, autor),
    eliminarComentario: (comentarioId) => repo.eliminarComentario(comentarioId),
    importarLocales: (locales, autor) => repo.importarDatosLocales(locales, autor),
    crearLead: (campos) => repo.crearLead(campos),
    actualizarLead: (leadId, campos) => repo.actualizarLead(leadId, campos),
    cambiarEtapaLead: (leadId, etapa) => repo.cambiarEtapaLead(leadId, etapa),
    eliminarLead: (leadId) => repo.eliminarLead(leadId),
    convertirLeadEnCliente: (lead) => repo.convertirLeadEnCliente(lead),
    agregarMiembro: (email, rol) => repo.agregarMiembro(email, rol),
    quitarMiembro: (email) => repo.quitarMiembro(email),
  };

  return (
    <CrmContext.Provider value={{ datos, cargando, sinAcceso, error, miRol, acciones }}>
      {children}
    </CrmContext.Provider>
  );
}

export function useCrm(): CrmContextValue {
  const contexto = useContext(CrmContext);
  if (!contexto) throw new Error("useCrm debe usarse dentro de CrmProvider");
  return contexto;
}
