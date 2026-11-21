/**
 * Iniciales para el avatar del usuario. Usa las dos primeras palabras del nombre
 * ("Ivor Montoya" → "IM"). Si no hay nombre, usa el inicio del email.
 */
export function iniciales(nombre: string | null | undefined, email: string | null | undefined): string {
  const base = nombre?.trim() || email?.split("@")[0] || "?";
  const partes = base.split(/\s+/).filter(Boolean);
  const letras = partes.length >= 2 ? `${partes[0][0]}${partes[1][0]}` : base.slice(0, 2);
  return letras.toUpperCase();
}
