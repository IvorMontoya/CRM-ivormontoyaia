"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AlertTriangle } from "lucide-react";
import { Logo } from "@/components/logo";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, firebaseConfigurado } from "@/lib/firebase";

const MENSAJES_ERROR: Record<string, string> = {
  "auth/invalid-credential": "Email o contraseña incorrectos.",
  "auth/wrong-password": "Email o contraseña incorrectos.",
  "auth/user-not-found": "Email o contraseña incorrectos.",
  "auth/invalid-email": "El email no es válido.",
  "auth/user-disabled": "Esta cuenta está desactivada.",
  "auth/too-many-requests": "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.",
  "auth/network-request-failed": "Sin conexión. Revisa tu red e inténtalo de nuevo.",
};

function mensajeError(error: unknown): string {
  if (error instanceof FirebaseError) {
    return MENSAJES_ERROR[error.code] ?? "No se pudo iniciar sesión. Inténtalo de nuevo.";
  }
  return "No se pudo iniciar sesión. Inténtalo de nuevo.";
}

export default function LoginPage() {
  const router = useRouter();
  const { usuario, cargando } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  // Si ya hay sesión, no tiene sentido ver el login.
  useEffect(() => {
    if (!cargando && usuario) router.replace("/panel");
  }, [cargando, usuario, router]);

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!auth) {
      setError("Firebase no está configurado. Revisa el archivo .env.local.");
      return;
    }
    setEnviando(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/panel");
    } catch (err) {
      setError(mensajeError(err));
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <Logo className="h-9" />
            CRM-ivormontoyaia
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Iniciar sesión</CardTitle>
            <CardDescription>
              Accede con el usuario que te ha creado el administrador.
            </CardDescription>
          </CardHeader>
          <form onSubmit={enviar}>
            <CardContent className="space-y-4">
              {!firebaseConfigurado && (
                <div className="flex gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <span>
                    Firebase no está configurado. Copia <code>.env.example</code> a <code>.env.local</code> y
                    rellena los valores.
                  </span>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={enviando || !firebaseConfigurado}>
                {enviando ? "Entrando..." : "Entrar"}
              </Button>
              <Link href="/" className="text-sm text-muted-foreground hover:underline">
                Volver a la portada
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
