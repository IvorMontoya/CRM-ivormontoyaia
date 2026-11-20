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
}

export interface Comentario {
  id: string;
  proyectoId: string;
  texto: string;
  autor: string;
  creadoEn: string;
}

export interface DatosCrm {
  clientes: Cliente[];
  proyectos: Proyecto[];
  comentarios: Comentario[];
}

export type CamposCliente = Pick<Cliente, "nombre" | "empresa" | "email">;
export type CamposProyecto = Pick<Proyecto, "clienteId" | "nombre" | "descripcion" | "estado">;

export function datosVacios(): DatosCrm {
  return { clientes: [], proyectos: [], comentarios: [] };
}
