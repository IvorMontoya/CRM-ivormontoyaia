"use client";

import { useState } from "react";
import { toast } from "sonner";
import { sendEmailVerification } from "firebase/auth";
import { MailCheck } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { mensajePerfil } from "@/lib/perfil";

/** Pantalla que bloquea el panel hasta que el email del usuario está verificado. */
export function VerificarEmail() {
  const { usuario, refrescarUsuario, cerrarSesion } = useAuth();
  const [enviando, setEnviando] = useState(false);
  const [comprobando, setComprobando] = useState(false);

  async function reenviar() {
    if (!usuario) return;
    setEnviando(true);
    try {
      await sendEmailVerification(usuario);
      toast.success(`Hemos enviado un enlace de verificación a ${usuario.email}`);
    } catch (fallo) {
      toast.error(mensajePerfil(fallo));
    } finally {
      setEnviando(false);
    }
  }

  async function comprobar() {
    setComprobando(true);
    try {
      await refrescarUsuario();
      if (!usuario?.emailVerified) toast.message("Todavía no está verificado. Revisa el enlace del correo.");
    } catch (fallo) {
      toast.error(mensajePerfil(fallo));
    } finally {
      setComprobando(false);
    }
  }

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-muted">
            <MailCheck className="size-5" />
          </div>
          <CardTitle>Verifica tu email</CardTitle>
          <CardDescription>
            Para entrar en la agencia necesitas confirmar tu dirección{" "}
            <span className="font-medium text-foreground">{usuario?.email}</span>. Abre el enlace que te enviamos y
            pulsa &quot;Ya lo he verificado&quot;.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button onClick={() => void comprobar()} disabled={comprobando}>
            {comprobando ? "Comprobando..." : "Ya lo he verificado"}
          </Button>
          <Button variant="outline" onClick={() => void reenviar()} disabled={enviando}>
            {enviando ? "Enviando..." : "Reenviar el enlace"}
          </Button>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full" onClick={() => void cerrarSesion()}>
            Cerrar sesión
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
