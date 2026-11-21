import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
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
  CamposLead,
  CamposProyecto,
  Cliente,
  Comentario,
  DatosCrm,
  DatosLocales,
  EstadoProyecto,
  EtapaLead,
  Lead,
  Miembro,
  Proyecto,
  RolMiembro,
} from "./tipos";

// ---------------------------------------------------------------------------
// Acceso a Firestore. Los datos de la agencia viven en `agencia/principal`;
// las reglas (`firestore.rules`) solo dejan entrar a los miembros verificados.
// ---------------------------------------------------------------------------

type Coleccion = "clientes" | "proyectos" | "comentarios" | "leads";
type Operacion = (lote: WriteBatch) => void;

// Firestore admite hasta 500 operaciones por lote. Usamos un margen.
const TAM_LOTE = 400;

// Límites que coinciden con las reglas. Se aplican al escribir para no recibir rechazos.
const LIMITES = { nombre: 120, empresa: 120, email: 254, clienteId: 128, descripcion: 2000, texto: 5000, telefono: 40, origen: 60, notas: 2000 };

const ESTADOS_PROYECTO: EstadoProyecto[] = ["activo", "pausado", "cerrado"];
const ETAPAS: EtapaLead[] = ["nuevo", "contactado", "calificado", "propuesta", "negociacion", "ganado", "perdido"];

function raiz() {
  if (!db) throw new Error("Firestore no está configurado");
  return db;
}

function coleccion(nombre: Coleccion): CollectionReference {
  return collection(raiz(), "agencia", "principal", nombre);
}

function referencia(nombre: Coleccion, id: string): DocumentReference {
  return doc(raiz(), "agencia", "principal", nombre, id);
}

const recortar = (valor: unknown, maximo: number) =>
  typeof valor === "string" ? valor.trim().slice(0, maximo) : "";

const estadoValido = (valor: unknown): EstadoProyecto =>
  ESTADOS_PROYECTO.includes(valor as EstadoProyecto) ? (valor as EstadoProyecto) : "activo";

const etapaValida = (valor: unknown): EtapaLead =>
  ETAPAS.includes(valor as EtapaLead) ? (valor as EtapaLead) : "nuevo";

const ahora = () => new Date().toISOString();

// Mismos límites que las reglas: presupuesto entre 0 y 1.000.000.000 y fechas YYYY-MM-DD.
const presupuestoValido = (valor: unknown): number | null =>
  typeof valor === "number" && Number.isFinite(valor) && valor >= 0 && valor <= 1_000_000_000
    ? Math.round(valor * 100) / 100
    : null;

const fechaValida = (valor: unknown): string | null =>
  typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor) ? valor : null;

const valorLeadValido = (valor: unknown): number | null =>
  typeof valor === "number" && Number.isFinite(valor) && valor >= 0 && valor <= 1_000_000_000
    ? Math.round(valor * 100) / 100
    : null;

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

/**
 * Escucha las colecciones de la agencia y los miembros.
 * Si las reglas deniegan el acceso (no eres miembro o no has verificado el email), `alFallar` avisa.
 */
export function suscribirDatos(
  alCambiar: (datos: DatosCrm) => void,
  alFallar: (error: Error) => void,
): Unsubscribe {
  if (!db) {
    alFallar(new Error("Firestore no está configurado"));
    return () => {};
  }

  const listo = { clientes: false, proyectos: false, comentarios: false, leads: false, miembros: false };
  let clientes: Cliente[] = [];
  let proyectos: Proyecto[] = [];
  let comentarios: Comentario[] = [];
  let leads: Lead[] = [];
  let miembros: Miembro[] = [];

  // Solo avisamos cuando todas las colecciones han llegado al menos una vez.
  const emitir = () => {
    if (Object.values(listo).every(Boolean)) {
      alCambiar({ clientes, proyectos, comentarios, leads, miembros });
    }
  };

  const u1 = onSnapshot(
    coleccion("clientes"),
    (snap) => {
      clientes = porCreacion(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Cliente, "id">) })));
      listo.clientes = true;
      emitir();
    },
    alFallar,
  );
  const u2 = onSnapshot(
    coleccion("proyectos"),
    (snap) => {
      proyectos = porCreacion(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Proyecto, "id">) })));
      listo.proyectos = true;
      emitir();
    },
    alFallar,
  );
  const u3 = onSnapshot(
    coleccion("comentarios"),
    (snap) => {
      comentarios = porCreacion(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Comentario, "id">) })));
      listo.comentarios = true;
      emitir();
    },
    alFallar,
  );
  const u4 = onSnapshot(
    coleccion("leads"),
    (snap) => {
      leads = porCreacion(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Lead, "id">) })));
      listo.leads = true;
      emitir();
    },
    alFallar,
  );
  const u5 = onSnapshot(
    collection(raiz(), "miembros"),
    (snap) => {
      miembros = snap.docs
        .map((d) => ({ email: d.id, ...(d.data() as Omit<Miembro, "email">) }))
        .sort((a, b) => a.email.localeCompare(b.email));
      listo.miembros = true;
      emitir();
    },
    alFallar,
  );

  return () => {
    u1();
    u2();
    u3();
    u4();
    u5();
  };
}

// ---------------------------------------------------------------------------
// Clientes, proyectos y comentarios
// ---------------------------------------------------------------------------

export async function crearCliente(campos: CamposCliente): Promise<void> {
  await addDoc(coleccion("clientes"), {
    nombre: recortar(campos.nombre, LIMITES.nombre),
    empresa: recortar(campos.empresa, LIMITES.empresa),
    email: recortar(campos.email, LIMITES.email),
    creadoEn: ahora(),
  });
}

/** Borra el cliente con sus proyectos y comentarios. Los hijos se borran antes que el padre. */
export async function eliminarCliente(datos: DatosCrm, clienteId: string): Promise<void> {
  const proyectos = datos.proyectos.filter((p) => p.clienteId === clienteId);
  const idsProyectos = new Set(proyectos.map((p) => p.id));
  const comentarios = datos.comentarios.filter((c) => idsProyectos.has(c.proyectoId));

  await escribirPorLotes([
    ...comentarios.map((c) => (lote: WriteBatch) => lote.delete(referencia("comentarios", c.id))),
    ...proyectos.map((p) => (lote: WriteBatch) => lote.delete(referencia("proyectos", p.id))),
    (lote: WriteBatch) => lote.delete(referencia("clientes", clienteId)),
  ]);
}

export async function crearProyecto(campos: CamposProyecto): Promise<void> {
  await addDoc(coleccion("proyectos"), {
    clienteId: recortar(campos.clienteId, LIMITES.clienteId),
    nombre: recortar(campos.nombre, LIMITES.nombre),
    descripcion: recortar(campos.descripcion, LIMITES.descripcion),
    estado: estadoValido(campos.estado),
    presupuesto: presupuestoValido(campos.presupuesto),
    fechaInicio: fechaValida(campos.fechaInicio),
    fechaFin: fechaValida(campos.fechaFin),
    creadoEn: ahora(),
  });
}

export async function actualizarEstadoProyecto(proyectoId: string, estado: EstadoProyecto): Promise<void> {
  await updateDoc(referencia("proyectos", proyectoId), { estado: estadoValido(estado) });
}

export async function eliminarProyecto(datos: DatosCrm, proyectoId: string): Promise<void> {
  const comentarios = datos.comentarios.filter((c) => c.proyectoId === proyectoId);
  await escribirPorLotes([
    ...comentarios.map((c) => (lote: WriteBatch) => lote.delete(referencia("comentarios", c.id))),
    (lote: WriteBatch) => lote.delete(referencia("proyectos", proyectoId)),
  ]);
}

export async function crearComentario(proyectoId: string, texto: string, autor: string): Promise<void> {
  await addDoc(coleccion("comentarios"), {
    proyectoId: recortar(proyectoId, LIMITES.clienteId),
    texto: recortar(texto, LIMITES.texto),
    // Las reglas exigen que el autor sea el email del usuario autenticado.
    autor: recortar(autor, LIMITES.email),
    creadoEn: ahora(),
  });
}

export async function eliminarComentario(comentarioId: string): Promise<void> {
  await deleteDoc(referencia("comentarios", comentarioId));
}

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------

export async function crearLead(campos: CamposLead): Promise<void> {
  await addDoc(coleccion("leads"), limpiarLead(campos, ahora()));
}

export async function actualizarLead(leadId: string, campos: CamposLead): Promise<void> {
  await updateDoc(referencia("leads", leadId), { ...limpiarLead(campos, undefined), actualizadoEn: ahora() });
}

export async function cambiarEtapaLead(leadId: string, etapa: EtapaLead): Promise<void> {
  await updateDoc(referencia("leads", leadId), { etapa: etapaValida(etapa), actualizadoEn: ahora() });
}

export async function eliminarLead(leadId: string): Promise<void> {
  await deleteDoc(referencia("leads", leadId));
}

/** Crea un cliente a partir del lead y marca el lead como ganado, enlazado al cliente. */
export async function convertirLeadEnCliente(lead: Lead): Promise<void> {
  const clienteRef = doc(coleccion("clientes"));
  const lote = writeBatch(raiz());
  lote.set(clienteRef, {
    nombre: recortar(lead.empresa || lead.nombreContacto, LIMITES.nombre) || "Sin nombre",
    empresa: recortar(lead.empresa, LIMITES.empresa),
    email: recortar(lead.email, LIMITES.email),
    creadoEn: ahora(),
  });
  lote.update(referencia("leads", lead.id), {
    etapa: "ganado",
    clienteId: clienteRef.id,
    actualizadoEn: ahora(),
  });
  await lote.commit();
}

function limpiarLead(campos: CamposLead, creadoEn: string | undefined) {
  const datos: Record<string, unknown> = {
    nombreContacto: recortar(campos.nombreContacto, LIMITES.nombre),
    empresa: recortar(campos.empresa, LIMITES.empresa),
    email: recortar(campos.email, LIMITES.email),
    telefono: recortar(campos.telefono, LIMITES.telefono),
    origen: recortar(campos.origen, LIMITES.origen),
    valorEstimado: valorLeadValido(campos.valorEstimado),
    responsable: recortar(campos.responsable, LIMITES.email),
    etapa: etapaValida(campos.etapa),
    notas: recortar(campos.notas, LIMITES.notas),
  };
  if (campos.clienteId) datos.clienteId = recortar(campos.clienteId, LIMITES.clienteId);
  if (creadoEn) datos.creadoEn = creadoEn;
  return datos;
}

// ---------------------------------------------------------------------------
// Equipo (solo admins: lo impiden las reglas si no lo son)
// ---------------------------------------------------------------------------

export async function agregarMiembro(email: string, rol: RolMiembro): Promise<void> {
  const id = email.trim().toLowerCase();
  await setDoc(doc(raiz(), "miembros", id), { rol, creadoEn: ahora() });
}

export async function quitarMiembro(email: string): Promise<void> {
  await deleteDoc(doc(raiz(), "miembros", email.trim().toLowerCase()));
}

// ---------------------------------------------------------------------------
// Importación desde el navegador y migración desde la versión anterior
// ---------------------------------------------------------------------------

/** Copia los datos guardados en el navegador (versión anterior). Genera ids nuevos y reenlaza. */
export async function importarDatosLocales(
  locales: DatosLocales,
  autorDeComentarios: string,
): Promise<{ clientes: number; proyectos: number; comentarios: number }> {
  const operaciones: Operacion[] = [];
  const idClientes = new Map<string, string>();
  const idProyectos = new Map<string, string>();

  for (const c of locales.clientes) {
    const ref = doc(coleccion("clientes"));
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
    const ref = doc(coleccion("proyectos"));
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
      lote.set(doc(coleccion("comentarios")), {
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

/**
 * Copia los datos de la versión anterior (`usuarios/{uid}`) a la agencia compartida.
 * Mantiene los mismos ids, así que repetirla no duplica nada.
 */
export async function migrarDesdeUsuario(uid: string): Promise<{ clientes: number; proyectos: number; comentarios: number }> {
  const leer = (nombre: "clientes" | "proyectos" | "comentarios") =>
    getDocs(collection(raiz(), "usuarios", uid, nombre)).then((snap) => snap.docs);

  const [clientes, proyectos, comentarios] = await Promise.all([
    leer("clientes"),
    leer("proyectos"),
    leer("comentarios"),
  ]);

  const operaciones: Operacion[] = [
    ...clientes.map((d) => (lote: WriteBatch) => lote.set(referencia("clientes", d.id), d.data())),
    ...proyectos.map((d) => (lote: WriteBatch) => lote.set(referencia("proyectos", d.id), d.data())),
    ...comentarios.map((d) => (lote: WriteBatch) => lote.set(referencia("comentarios", d.id), d.data())),
  ];

  await escribirPorLotes(operaciones);
  return { clientes: clientes.length, proyectos: proyectos.length, comentarios: comentarios.length };
}
