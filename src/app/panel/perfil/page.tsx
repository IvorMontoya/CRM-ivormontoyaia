"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import type { User } from "firebase/auth";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cambiarContrasena, cambiarEmail, guardarNombre, mensajePerfil } from "@/lib/perfil";

export default function PerfilPage() {
  const { usuario, refrescarUsuario } = useAuth();
  // El layout del panel ya exige sesión; esta comprobación evita errores durante la carga.
  if (!usuario) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Mi perfil</h1>
        <p className="text-sm text-muted-foreground">Gestiona tu nombre, tu email y tu contraseña.</p>
      </div>

      <DatosPersonales usuario={usuario} onGuardado={refrescarUsuario} />
      <CambiarEmail usuario={usuario} />
      <CambiarContrasena usuario={usuario} />
    </div>
  );
}

function DatosPersonales({ usuario, onGuardado }: { usuario: User; onGuardado: () => Promise<void> }) {
  const [nombre, setNombre] = useState(usuario.displayName ?? "");
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    try {
      await guardarNombre(usuario, nombre);
      await onGuardado();
      toast.success("Nombre actualizado");
    } catch (fallo) {
      toast.error(mensajePerfil(fallo));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos personales</CardTitle>
        <CardDescription>El nombre se muestra en el menú lateral.</CardDescription>
      </CardHeader>
      <form onSubmit={enviar}>
        <CardContent className="space-y-2">
          <Label htmlFor="perfil-nombre">Nombre</Label>
          <Input id="perfil-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={80} />
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={enviando}>
            {enviando ? "Guardando..." : "Guardar nombre"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function CambiarEmail({ usuario }: { usuario: User }) {
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [contrasenaActual, setContrasenaActual] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviadoA, setEnviadoA] = useState<string | null>(null);

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const destino = nuevoEmail.trim();
    if (destino.toLowerCase() === (usuario.email ?? "").toLowerCase()) {
      toast.error("Esa ya es tu dirección actual.");
      return;
    }
    setEnviando(true);
    try {
      await cambiarEmail(usuario, contrasenaActual, destino);
      setEnviadoA(destino);
      setNuevoEmail("");
      setContrasenaActual("");
    } catch (fallo) {
      toast.error(mensajePerfil(fallo));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email</CardTitle>
        <CardDescription>
          Email actual: <span className="font-medium text-foreground">{usuario.email}</span>
        </CardDescription>
      </CardHeader>
      <form onSubmit={enviar}>
        <CardContent className="space-y-4">
          {enviadoA && (
            <p className="rounded-md border bg-muted/40 p-3 text-sm">
              Hemos enviado un enlace a <strong>{enviadoA}</strong>. El cambio se completa al confirmarlo. Después,
              vuelve a iniciar sesión con el nuevo email.
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="perfil-nuevo-email">Nuevo email</Label>
            <Input
              id="perfil-nuevo-email"
              type="email"
              autoComplete="email"
              required
              value={nuevoEmail}
              onChange={(e) => setNuevoEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="perfil-contrasena-email">Contraseña actual</Label>
            <Input
              id="perfil-contrasena-email"
              type="password"
              autoComplete="current-password"
              required
              value={contrasenaActual}
              onChange={(e) => setContrasenaActual(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={enviando}>
            {enviando ? "Enviando..." : "Cambiar email"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function CambiarContrasena({ usuario }: { usuario: User }) {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [repetir, setRepetir] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (nueva.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (nueva !== repetir) {
      toast.error("Las contraseñas nuevas no coinciden.");
      return;
    }
    if (nueva === actual) {
      toast.error("La nueva contraseña debe ser distinta de la actual.");
      return;
    }
    setEnviando(true);
    try {
      await cambiarContrasena(usuario, actual, nueva);
      toast.success("Contraseña actualizada");
      setActual("");
      setNueva("");
      setRepetir("");
    } catch (fallo) {
      toast.error(mensajePerfil(fallo));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contraseña</CardTitle>
        <CardDescription>Mínimo 6 caracteres.</CardDescription>
      </CardHeader>
      <form onSubmit={enviar}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="perfil-actual">Contraseña actual</Label>
            <Input
              id="perfil-actual"
              type="password"
              autoComplete="current-password"
              required
              value={actual}
              onChange={(e) => setActual(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="perfil-nueva">Nueva contraseña</Label>
            <Input
              id="perfil-nueva"
              type="password"
              autoComplete="new-password"
              required
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="perfil-repetir">Repetir nueva contraseña</Label>
            <Input
              id="perfil-repetir"
              type="password"
              autoComplete="new-password"
              required
              value={repetir}
              onChange={(e) => setRepetir(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={enviando}>
            {enviando ? "Guardando..." : "Cambiar contraseña"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
