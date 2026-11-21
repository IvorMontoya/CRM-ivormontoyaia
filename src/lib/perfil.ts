import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
  verifyBeforeUpdateEmail,
  type User,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

// Operaciones sobre la cuenta del usuario autenticado. Las que son sensibles
// (email y contraseña) piden reautenticación con la contraseña actual.

export async function guardarNombre(usuario: User, nombre: string): Promise<void> {
  await updateProfile(usuario, { displayName: nombre.trim().slice(0, 80) || null });
}

async function reautenticar(usuario: User, contrasenaActual: string): Promise<void> {
  if (!usuario.email) throw new Error("La cuenta no tiene email");
  const credencial = EmailAuthProvider.credential(usuario.email, contrasenaActual);
  await reauthenticateWithCredential(usuario, credencial);
}

export async function cambiarContrasena(
  usuario: User,
  contrasenaActual: string,
  contrasenaNueva: string,
): Promise<void> {
  await reautenticar(usuario, contrasenaActual);
  await updatePassword(usuario, contrasenaNueva);
}

/** Envía un enlace a la nueva dirección. El cambio se completa al confirmarlo. */
export async function cambiarEmail(usuario: User, contrasenaActual: string, nuevoEmail: string): Promise<void> {
  await reautenticar(usuario, contrasenaActual);
  await verifyBeforeUpdateEmail(usuario, nuevoEmail.trim());
}

const MENSAJES: Record<string, string> = {
  "auth/invalid-credential": "La contraseña actual no es correcta.",
  "auth/wrong-password": "La contraseña actual no es correcta.",
  "auth/weak-password": "La nueva contraseña debe tener al menos 6 caracteres.",
  "auth/email-already-in-use": "Ese email ya está en uso.",
  "auth/invalid-email": "El email no es válido.",
  "auth/requires-recent-login": "Por seguridad, vuelve a iniciar sesión y repite la operación.",
  "auth/too-many-requests": "Demasiados intentos. Espera unos minutos.",
  "auth/network-request-failed": "Sin conexión. Revisa tu red e inténtalo de nuevo.",
};

export function mensajePerfil(error: unknown): string {
  if (error instanceof FirebaseError) {
    return MENSAJES[error.code] ?? "No se pudo guardar. Inténtalo de nuevo.";
  }
  return "No se pudo guardar. Inténtalo de nuevo.";
}
