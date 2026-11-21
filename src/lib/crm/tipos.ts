export type EstadoProyecto = "activo" | "pausado" | "cerrado";

export const ESTADOS_PROYECTO: Record<EstadoProyecto, string> = {
  activo: "Activo",
  pausado: "Pausado",
  cerrado: "Cerrado",
};

export interface Cliente {
  id: string;
  nombre: string;
  empresa: string;
  email: string;
  creadoEn: string;
}

export interface Proyecto {
  id: string;
  clienteId: string;
  nombre: string;
  descripcion: string;
  estado: EstadoProyecto;
  creadoEn: string;
  /** Importe en euros. Opcional: los proyectos antiguos no lo tienen. */
  presupuesto?: number | null;
  /** Fechas en formato YYYY-MM-DD. */
  fechaInicio?: string | null;
  fechaFin?: string | null;
}

export interface Comentario {
  id: string;
  proyectoId: string;
  texto: string;
  autor: string;
  creadoEn: string;
}

export type EtapaLead = "nuevo" | "contactado" | "calificado" | "propuesta" | "negociacion" | "ganado" | "perdido";

export const ETAPAS_LEAD: Record<EtapaLead, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  calificado: "Calificado",
  propuesta: "Propuesta",
  negociacion: "Negociación",
  ganado: "Ganado",
  perdido: "Perdido",
};

export interface Lead {
  id: string;
  nombreContacto: string;
  empresa: string;
  email: string;
  telefono: string;
  origen: string;
  valorEstimado: number | null;
  /** Email del miembro responsable. */
  responsable: string;
  etapa: EtapaLead;
  notas: string;
  /** Cliente creado al convertir el lead. */
  clienteId?: string;
  creadoEn: string;
  actualizadoEn?: string;
}

export type CamposLead = Omit<Lead, "id" | "creadoEn" | "actualizadoEn">;

export type RolMiembro = "admin" | "miembro";

export interface Miembro {
  /** Email del miembro; también es el id del documento. */
  email: string;
  rol: RolMiembro;
  creadoEn: string;
}

export interface DatosCrm {
  clientes: Cliente[];
  proyectos: Proyecto[];
  comentarios: Comentario[];
  leads: Lead[];
  miembros: Miembro[];
}

/** Datos de la versión anterior guardados en el navegador: solo lo que se puede importar. */
export type DatosLocales = Pick<DatosCrm, "clientes" | "proyectos" | "comentarios">;

export type CamposCliente = Pick<Cliente, "nombre" | "empresa" | "email">;
export type CamposProyecto = Pick<Proyecto, "clienteId" | "nombre" | "descripcion" | "estado"> &
  Partial<Pick<Proyecto, "presupuesto" | "fechaInicio" | "fechaFin">>;

export function datosVacios(): DatosCrm {
  return { clientes: [], proyectos: [], comentarios: [], leads: [], miembros: [] };
}
