import {
  datosVacios,
  type CamposCliente,
  type CamposProyecto,
  type Cliente,
  type Comentario,
  type DatosCrm,
  type EstadoProyecto,
  type Proyecto,
} from "./tipos";

// ---------------------------------------------------------------------------
// Almacenamiento local (sin base de datos).
// Los datos se guardan en el navegador, separados por usuario. Cuando se añada
// una base de datos, solo cambian estas dos funciones de carga y guardado.
// ---------------------------------------------------------------------------

const clave = (uid: string) => `crm-ivormontoyaia:v1:${uid}`;

export function cargarDatos(uid: string): DatosCrm {
  try {
    const bruto = window.localStorage.getItem(clave(uid));
    if (!bruto) return datosVacios();
    const parseado = JSON.parse(bruto) as Partial<DatosCrm>;
    return {
      clientes: Array.isArray(parseado.clientes) ? parseado.clientes : [],
      proyectos: Array.isArray(parseado.proyectos) ? parseado.proyectos : [],
      comentarios: Array.isArray(parseado.comentarios) ? parseado.comentarios : [],
    };
  } catch {
    // Datos corruptos o almacenamiento bloqueado: se empieza con datos vacíos.
    return datosVacios();
  }
}

export function guardarDatos(uid: string, datos: DatosCrm): void {
  try {
    window.localStorage.setItem(clave(uid), JSON.stringify(datos));
  } catch {
    // Si el navegador no permite guardar, los datos siguen en memoria durante la sesión.
  }
}

// ---------------------------------------------------------------------------
// Operaciones puras sobre los datos. Devuelven un objeto nuevo y no tocan el almacenamiento.
// ---------------------------------------------------------------------------

function nuevoId(): string {
  return crypto.randomUUID();
}

export function anadirCliente(datos: DatosCrm, campos: CamposCliente): DatosCrm {
  const cliente: Cliente = { id: nuevoId(), creadoEn: new Date().toISOString(), ...campos };
  return { ...datos, clientes: [...datos.clientes, cliente] };
}

export function eliminarCliente(datos: DatosCrm, clienteId: string): DatosCrm {
  const proyectosDelCliente = new Set(
    datos.proyectos.filter((p) => p.clienteId === clienteId).map((p) => p.id),
  );
  return {
    clientes: datos.clientes.filter((c) => c.id !== clienteId),
    proyectos: datos.proyectos.filter((p) => p.clienteId !== clienteId),
    comentarios: datos.comentarios.filter((c) => !proyectosDelCliente.has(c.proyectoId)),
  };
}

export function anadirProyecto(datos: DatosCrm, campos: CamposProyecto): DatosCrm {
  const proyecto: Proyecto = { id: nuevoId(), creadoEn: new Date().toISOString(), ...campos };
  return { ...datos, proyectos: [...datos.proyectos, proyecto] };
}

export function actualizarEstadoProyecto(
  datos: DatosCrm,
  proyectoId: string,
  estado: EstadoProyecto,
): DatosCrm {
  return {
    ...datos,
    proyectos: datos.proyectos.map((p) => (p.id === proyectoId ? { ...p, estado } : p)),
  };
}

export function eliminarProyecto(datos: DatosCrm, proyectoId: string): DatosCrm {
  return {
    ...datos,
    proyectos: datos.proyectos.filter((p) => p.id !== proyectoId),
    comentarios: datos.comentarios.filter((c) => c.proyectoId !== proyectoId),
  };
}

export function anadirComentario(
  datos: DatosCrm,
  proyectoId: string,
  texto: string,
  autor: string,
): DatosCrm {
  const comentario: Comentario = {
    id: nuevoId(),
    proyectoId,
    texto,
    autor,
    creadoEn: new Date().toISOString(),
  };
  return { ...datos, comentarios: [...datos.comentarios, comentario] };
}

export function eliminarComentario(datos: DatosCrm, comentarioId: string): DatosCrm {
  return { ...datos, comentarios: datos.comentarios.filter((c) => c.id !== comentarioId) };
}
