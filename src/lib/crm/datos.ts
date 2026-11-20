import type { DatosCrm } from "./tipos";

// ---------------------------------------------------------------------------
// Datos guardados en el navegador por la versión anterior (localStorage).
// Solo se usan para la importación única a Firestore.
// ---------------------------------------------------------------------------

const clave = (uid: string) => `crm-ivormontoyaia:v1:${uid}`;
const claveImportado = (uid: string) => `crm-ivormontoyaia:importado:${uid}`;

/** Devuelve los datos locales si hay algo pendiente de importar; si no, `null`. */
export function leerDatosLocales(uid: string): DatosCrm | null {
  try {
    if (window.localStorage.getItem(claveImportado(uid))) return null;
    const bruto = window.localStorage.getItem(clave(uid));
    if (!bruto) return null;
    const parseado = JSON.parse(bruto) as Partial<DatosCrm>;
    const datos: DatosCrm = {
      clientes: Array.isArray(parseado.clientes) ? parseado.clientes : [],
      proyectos: Array.isArray(parseado.proyectos) ? parseado.proyectos : [],
      comentarios: Array.isArray(parseado.comentarios) ? parseado.comentarios : [],
    };
    const total = datos.clientes.length + datos.proyectos.length + datos.comentarios.length;
    return total > 0 ? datos : null;
  } catch {
    return null;
  }
}

/** Marca los datos locales como importados. No los borra: quedan como copia de seguridad. */
export function marcarDatosLocalesImportados(uid: string): void {
  try {
    window.localStorage.setItem(claveImportado(uid), new Date().toISOString());
  } catch {
    // Sin almacenamiento, el botón podría volver a aparecer; no es grave.
  }
}
