import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  writeBatch,
  type CollectionReference,
  type DocumentReference,
  type Unsubscribe,
  type WriteBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  CamposCliente,
  CamposProyecto,
  Cliente,
  Comentario,
  DatosCrm,
  EstadoProyecto,
  Proyecto,
} from "./tipos";

// ---------------------------------------------------------------------------
// Acceso a Firestore. Todas las rutas cuelgan de `usuarios/{uid}`, que es lo que
// permiten las reglas de `firestore.rules`.
// ---------------------------------------------------------------------------

type Nombre = "clientes" | "proyectos" | "comentarios";
type Operacion = (lote: WriteBatch) => void;

// Firestore admite hasta 500 operaciones por lote. Usamos un margen.
const TAM_LOTE = 400;

// Límites que coinciden con las reglas. Se aplican al escribir para no recibir rechazos.
const LIMITES = { nombre: 120, empresa: 120, email: 254, clienteId: 128, descripcion: 2000, texto: 5000 };

const ESTADOS: EstadoProyecto[] = ["activo", "pausado", "cerrado"];

function raiz() {
  if (!db) throw new Error("Firestore no está configurado");
  return db;
}

function coleccion(uid: string, nombre: Nombre): CollectionReference {
  return collection(raiz(), "usuarios", uid, nombre);
}

function referencia(uid: string, nombre: Nombre, id: string): DocumentReference {
  return doc(raiz(), "usuarios", uid, nombre, id);
}

const recortar = (valor: unknown, maximo: number) =>
  typeof valor === "string" ? valor.trim().slice(0, maximo) : "";

const estadoValido = (valor: unknown): EstadoProyecto =>
  ESTADOS.includes(valor as EstadoProyecto) ? (valor as EstadoProyecto) : "activo";

const ahora = () => new Date().toISOString();

async function escribirPorLotes(operaciones: Operacion[]) {
  for (let i = 0; i < operaciones.length; i += TAM_LOTE) {
    const lote = writeBatch(raiz());
    operaciones.slice(i, i + TAM_LOTE).forEach((op) => op(lote));
    await lote.commit();
  }
}

// ---------------------------------------------------------------------------
// Lectura en tiempo real
// ---------------------------------------------------------------------------

const porCreacion = <T extends { creadoEn: string }>(items: T[]) =>
  items.sort((a, b) => String(a.creadoEn ?? "").localeCompare(String(b.creadoEn ?? "")));

/** Escucha las tres colecciones y avisa cuando hay cambios. Devuelve la función para dejar de escuchar. */
export function suscribirDatos(
  uid: string,
  alCambiar: (datos: DatosCrm) => void,
  alFallar: (error: Error) => void,
): Unsubscribe {
  if (!db) {
    alFallar(new Error("Firestore no está configurado"));
    return () => {};
  }

  const listo = { clientes: false, proyectos: false, comentarios: false };
  let clientes: Cliente[] = [];
  let proyectos: Proyecto[] = [];
  let comentarios: Comentario[] = [];

  // Solo avisamos cuando las tres colecciones han llegado al menos una vez.
  const emitir = () => {
    if (listo.clientes && listo.proyectos && listo.comentarios) {
      alCambiar({ clientes, proyectos, comentarios });
    }
  };

  const u1 = onSnapshot(
    coleccion(uid, "clientes"),
    (snap) => {
      clientes = porCreacion(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Cliente, "id">) })));
      listo.clientes = true;
      emitir();
    },
    alFallar,
  );
  const u2 = onSnapshot(
    coleccion(uid, "proyectos"),
    (snap) => {
      proyectos = porCreacion(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Proyecto, "id">) })));
      listo.proyectos = true;
      emitir();
    },
    alFallar,
  );
  const u3 = onSnapshot(
    coleccion(uid, "comentarios"),
    (snap) => {
      comentarios = porCreacion(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Comentario, "id">) })));
      listo.comentarios = true;
      emitir();
    },
    alFallar,
  );

  return () => {
    u1();
    u2();
    u3();
  };
}

// ---------------------------------------------------------------------------
// Escritura
// ---------------------------------------------------------------------------

export async function crearCliente(uid: string, campos: CamposCliente): Promise<void> {
  await addDoc(coleccion(uid, "clientes"), {
    nombre: recortar(campos.nombre, LIMITES.nombre),
    empresa: recortar(campos.empresa, LIMITES.empresa),
    email: recortar(campos.email, LIMITES.email),
    creadoEn: ahora(),
  });
}

/** Borra el cliente con sus proyectos y comentarios. Los hijos se borran antes que el padre. */
export async function eliminarCliente(uid: string, datos: DatosCrm, clienteId: string): Promise<void> {
  const proyectos = datos.proyectos.filter((p) => p.clienteId === clienteId);
  const idsProyectos = new Set(proyectos.map((p) => p.id));
  const comentarios = datos.comentarios.filter((c) => idsProyectos.has(c.proyectoId));

  await escribirPorLotes([
    ...comentarios.map((c) => (lote: WriteBatch) => lote.delete(referencia(uid, "comentarios", c.id))),
    ...proyectos.map((p) => (lote: WriteBatch) => lote.delete(referencia(uid, "proyectos", p.id))),
    (lote: WriteBatch) => lote.delete(referencia(uid, "clientes", clienteId)),
  ]);
}

export async function crearProyecto(uid: string, campos: CamposProyecto): Promise<void> {
  await addDoc(coleccion(uid, "proyectos"), {
    clienteId: recortar(campos.clienteId, LIMITES.clienteId),
    nombre: recortar(campos.nombre, LIMITES.nombre),
    descripcion: recortar(campos.descripcion, LIMITES.descripcion),
    estado: estadoValido(campos.estado),
    creadoEn: ahora(),
  });
}

export async function actualizarEstadoProyecto(
  uid: string,
  proyectoId: string,
  estado: EstadoProyecto,
): Promise<void> {
  await updateDoc(referencia(uid, "proyectos", proyectoId), { estado: estadoValido(estado) });
}

export async function eliminarProyecto(uid: string, datos: DatosCrm, proyectoId: string): Promise<void> {
  const comentarios = datos.comentarios.filter((c) => c.proyectoId === proyectoId);
  await escribirPorLotes([
    ...comentarios.map((c) => (lote: WriteBatch) => lote.delete(referencia(uid, "comentarios", c.id))),
    (lote: WriteBatch) => lote.delete(referencia(uid, "proyectos", proyectoId)),
  ]);
}

export async function crearComentario(
  uid: string,
  proyectoId: string,
  texto: string,
  autor: string,
): Promise<void> {
  await addDoc(coleccion(uid, "comentarios"), {
    proyectoId: recortar(proyectoId, LIMITES.clienteId),
    texto: recortar(texto, LIMITES.texto),
    // Las reglas exigen que el autor sea el email del usuario autenticado.
    autor: recortar(autor, LIMITES.email),
    creadoEn: ahora(),
  });
}

export async function eliminarComentario(uid: string, comentarioId: string): Promise<void> {
  await deleteDoc(referencia(uid, "comentarios", comentarioId));
}

/**
 * Copia los datos guardados en el navegador a Firestore.
 * Genera ids nuevos y reenlaza clientes, proyectos y comentarios. Los huérfanos se descartan.
 */
export async function importarDatosLocales(
  uid: string,
  locales: DatosCrm,
  autorDeComentarios: string,
): Promise<{ clientes: number; proyectos: number; comentarios: number }> {
  const operaciones: Operacion[] = [];
  const idClientes = new Map<string, string>();
  const idProyectos = new Map<string, string>();

  for (const c of locales.clientes) {
    const ref = doc(coleccion(uid, "clientes"));
    idClientes.set(c.id, ref.id);
    operaciones.push((lote) =>
      lote.set(ref, {
        nombre: recortar(c.nombre, LIMITES.nombre) || "Sin nombre",
        empresa: recortar(c.empresa, LIMITES.empresa),
        email: recortar(c.email, LIMITES.email),
        creadoEn: c.creadoEn || ahora(),
      }),
    );
  }

  let proyectos = 0;
  for (const p of locales.proyectos) {
    const clienteNuevo = idClientes.get(p.clienteId);
    if (!clienteNuevo) continue;
    const ref = doc(coleccion(uid, "proyectos"));
    idProyectos.set(p.id, ref.id);
    proyectos++;
    operaciones.push((lote) =>
      lote.set(ref, {
        clienteId: clienteNuevo,
        nombre: recortar(p.nombre, LIMITES.nombre) || "Sin nombre",
        descripcion: recortar(p.descripcion, LIMITES.descripcion),
        estado: estadoValido(p.estado),
        creadoEn: p.creadoEn || ahora(),
      }),
    );
  }

  let comentarios = 0;
  for (const c of locales.comentarios) {
    const proyectoNuevo = idProyectos.get(c.proyectoId);
    const texto = recortar(c.texto, LIMITES.texto);
    if (!proyectoNuevo || !texto) continue;
    comentarios++;
    operaciones.push((lote) =>
      lote.set(doc(coleccion(uid, "comentarios")), {
        proyectoId: proyectoNuevo,
        texto,
        autor: autorDeComentarios,
        creadoEn: c.creadoEn || ahora(),
      }),
    );
  }

  await escribirPorLotes(operaciones);
  return { clientes: idClientes.size, proyectos, comentarios };
}
