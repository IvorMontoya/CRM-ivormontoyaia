"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextValue {
  usuario: User | null;
  cargando: boolean;
  cerrarSesion: () => Promise<void>;
  /** Recarga los datos del usuario (nombre, email) tras editar su perfil. */
  refrescarUsuario: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<User | null>(null);
  // Sin Firebase configurado no hay nada que esperar.
  const [cargando, setCargando] = useState(() => auth !== null);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, async (u) => {
      // Un token antiguo no refleja la verificación del email: las reglas lo leerían mal.
      if (u) {
        try {
          await u.getIdToken(true);
        } catch {
          // Sin red no podemos renovarlo; la app seguirá con el token que tenga.
        }
      }
      setUsuario(u);
      setCargando(false);
    });
  }, []);

  // `reload()` actualiza el mismo objeto de usuario; este contador fuerza el re-render de los consumidores.
  const [, setRevision] = useState(0);

  const cerrarSesion = async () => {
    if (auth) await signOut(auth);
  };

  const refrescarUsuario = async () => {
    if (!auth?.currentUser) return;
    await auth.currentUser.reload();
    // Las reglas leen `email_verified` del token: hay que pedir uno nuevo tras verificar.
    await auth.currentUser.getIdToken(true);
    setRevision((r) => r + 1);
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, cerrarSesion, refrescarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return contexto;
}
