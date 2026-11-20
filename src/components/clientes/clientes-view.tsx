"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Building2, FolderKanban, Mail, MessageSquare, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/auth-provider";
import { useCrm } from "@/components/crm-provider";
import {
  ESTADOS_PROYECTO,
  type CamposCliente,
  type CamposProyecto,
  type EstadoProyecto,
} from "@/lib/crm/tipos";
import { cn } from "@/lib/utils";

const fecha = (iso: string) =>
  new Date(iso).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" });

const avisarFallo = () => toast.error("No se pudo guardar. Revisa la conexión e inténtalo de nuevo.");

export function ClientesView() {
  const { datos, cargando, acciones } = useCrm();
  const { usuario } = useAuth();
  const [clienteId, setClienteId] = useState<string | null>(null);
  const [proyectoId, setProyectoId] = useState<string | null>(null);

  // Si el cliente o el proyecto seleccionado se elimina, la selección desaparece sola.
  const cliente = datos.clientes.find((c) => c.id === clienteId) ?? null;
  const proyectosDelCliente = cliente
    ? datos.proyectos.filter((p) => p.clienteId === cliente.id)
    : [];
  const proyecto = proyectosDelCliente.find((p) => p.id === proyectoId) ?? null;

  async function crearCliente(campos: CamposCliente) {
    try {
      await acciones.crearCliente(campos);
      toast.success(`Cliente "${campos.nombre}" creado`);
    } catch {
      avisarFallo();
    }
  }

  async function borrarCliente() {
    if (!cliente) return;
    if (!window.confirm(`¿Eliminar a "${cliente.nombre}" con sus proyectos y comentarios?`)) return;
    try {
      await acciones.eliminarCliente(cliente.id);
      setClienteId(null);
      setProyectoId(null);
      toast.success("Cliente eliminado");
    } catch {
      avisarFallo();
    }
  }

  async function crearProyecto(campos: CamposProyecto) {
    try {
      await acciones.crearProyecto(campos);
      toast.success(`Proyecto "${campos.nombre}" creado`);
    } catch {
      avisarFallo();
    }
  }

  async function borrarProyecto() {
    if (!proyecto) return;
    if (!window.confirm(`¿Eliminar el proyecto "${proyecto.nombre}" y sus comentarios?`)) return;
    try {
      await acciones.eliminarProyecto(proyecto.id);
      setProyectoId(null);
      toast.success("Proyecto eliminado");
    } catch {
      avisarFallo();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Cada cliente tiene sus proyectos, y cada proyecto tiene sus comentarios.
          </p>
        </div>
        <NuevoClienteDialog onCrear={crearCliente} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Lista de clientes */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Clientes ({datos.clientes.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {cargando && <p className="text-sm text-muted-foreground">Cargando clientes...</p>}
            {!cargando && datos.clientes.length === 0 && (
              <p className="text-sm text-muted-foreground">Todavía no hay clientes.</p>
            )}
            {datos.clientes.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setClienteId(c.id);
                  setProyectoId(null);
                }}
                className={cn(
                  "w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent",
                  c.id === clienteId && "bg-accent font-medium",
                )}
              >
                <div className="truncate">{c.nombre}</div>
                {c.empresa && (
                  <div className="truncate text-xs text-muted-foreground">{c.empresa}</div>
                )}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Detalle */}
        <div className="min-w-0 space-y-6">
          {!cliente && (
            <Card>
              <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                <Building2 className="size-8 text-muted-foreground" />
                <p className="font-medium">Selecciona un cliente</p>
                <p className="text-sm text-muted-foreground">
                  O crea uno nuevo con el botón de arriba.
                </p>
              </CardContent>
            </Card>
          )}

          {cliente && (
            <>
              <Card>
                <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                  <div className="min-w-0">
                    <CardTitle className="truncate text-xl">{cliente.nombre}</CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      {cliente.empresa && (
                        <span className="flex items-center gap-1">
                          <Building2 className="size-3.5" /> {cliente.empresa}
                        </span>
                      )}
                      {cliente.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="size-3.5" /> {cliente.email}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => void borrarCliente()} aria-label="Eliminar cliente">
                    <Trash2 className="size-4" /> Eliminar
                  </Button>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FolderKanban className="size-4" /> Proyectos ({proyectosDelCliente.length})
                  </CardTitle>
                  <NuevoProyectoDialog clienteId={cliente.id} onCrear={crearProyecto} />
                </CardHeader>
                <CardContent className="space-y-2">
                  {proyectosDelCliente.length === 0 && (
                    <p className="text-sm text-muted-foreground">Este cliente aún no tiene proyectos.</p>
                  )}
                  {proyectosDelCliente.map((p) => {
                    const numComentarios = datos.comentarios.filter((c) => c.proyectoId === p.id).length;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setProyectoId(p.id)}
                        className={cn(
                          "flex w-full items-center justify-between gap-3 rounded-md border px-3 py-2 text-left text-sm transition-colors hover:bg-accent",
                          p.id === proyectoId && "border-primary bg-accent",
                        )}
                      >
                        <span className="min-w-0 truncate font-medium">{p.nombre}</span>
                        <span className="flex shrink-0 items-center gap-2">
                          <Badge variant="secondary">{ESTADOS_PROYECTO[p.estado]}</Badge>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MessageSquare className="size-3.5" /> {numComentarios}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>

              {proyecto && (
                <Card>
                  <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                    <div className="min-w-0 space-y-1">
                      <CardTitle className="truncate text-lg">{proyecto.nombre}</CardTitle>
                      {proyecto.descripcion && (
                        <CardDescription className="whitespace-pre-line">{proyecto.descripcion}</CardDescription>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <select
                        aria-label="Estado del proyecto"
                        value={proyecto.estado}
                        onChange={(e) =>
                          acciones
                            .cambiarEstadoProyecto(proyecto.id, e.target.value as EstadoProyecto)
                            .catch(avisarFallo)
                        }
                        className="h-8 rounded-md border border-input bg-transparent px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {(Object.keys(ESTADOS_PROYECTO) as EstadoProyecto[]).map((estado) => (
                          <option key={estado} value={estado}>
                            {ESTADOS_PROYECTO[estado]}
                          </option>
                        ))}
                      </select>
                      <Button variant="ghost" size="sm" onClick={() => void borrarProyecto()} aria-label="Eliminar proyecto">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ComentariosProyecto
                      key={proyecto.id}
                      proyectoId={proyecto.id}
                      autor={usuario?.email ?? "Usuario"}
                    />
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ComentariosProyecto({ proyectoId, autor }: { proyectoId: string; autor: string }) {
  const { datos, acciones } = useCrm();
  const [texto, setTexto] = useState("");
  const comentarios = datos.comentarios.filter((c) => c.proyectoId === proyectoId);

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const limpio = texto.trim();
    if (!limpio) return;
    setTexto("");
    acciones.crearComentario(proyectoId, limpio, autor).catch(() => {
      setTexto(limpio);
      avisarFallo();
    });
  }

  function borrar(comentarioId: string) {
    if (!window.confirm("¿Eliminar este comentario?")) return;
    acciones.eliminarComentario(comentarioId).catch(avisarFallo);
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Comentarios ({comentarios.length})</h3>

      {comentarios.length === 0 && (
        <p className="text-sm text-muted-foreground">Todavía no hay comentarios en este proyecto.</p>
      )}

      <ul className="space-y-3">
        {comentarios.map((c) => (
          <li key={c.id} className="rounded-lg border bg-muted/40 p-3">
            <div className="mb-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <span className="truncate">
                {c.autor} · {fecha(c.creadoEn)}
              </span>
              <Button variant="ghost" size="icon" className="size-7" onClick={() => borrar(c.id)} aria-label="Eliminar comentario">
                <Trash2 className="size-3.5" />
              </Button>
            </div>
            <p className="whitespace-pre-wrap text-sm">{c.texto}</p>
          </li>
        ))}
      </ul>

      <form onSubmit={enviar} className="space-y-2">
        <Label htmlFor="nuevo-comentario" className="sr-only">
          Nuevo comentario
        </Label>
        <Textarea
          id="nuevo-comentario"
          placeholder="Escribe un comentario..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={3}
        />
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={!texto.trim()}>
            Añadir comentario
          </Button>
        </div>
      </form>
    </div>
  );
}

function NuevoClienteDialog({ onCrear }: { onCrear: (campos: CamposCliente) => void }) {
  const [abierto, setAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [email, setEmail] = useState("");

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!nombre.trim()) return;
    onCrear({ nombre: nombre.trim(), empresa: empresa.trim(), email: email.trim() });
    setNombre("");
    setEmpresa("");
    setEmail("");
    setAbierto(false);
  }

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger render={<Button />}>
        <Plus className="size-4" /> Nuevo cliente
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={enviar} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Nuevo cliente</DialogTitle>
            <DialogDescription>Los datos se guardan solo en este navegador.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="cliente-nombre">Nombre *</Label>
            <Input id="cliente-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cliente-empresa">Empresa</Label>
            <Input id="cliente-empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cliente-email">Email de contacto</Label>
            <Input id="cliente-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="submit">Crear cliente</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function NuevoProyectoDialog({
  clienteId,
  onCrear,
}: {
  clienteId: string;
  onCrear: (campos: CamposProyecto) => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState<EstadoProyecto>("activo");

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!nombre.trim()) return;
    onCrear({ clienteId, nombre: nombre.trim(), descripcion: descripcion.trim(), estado });
    setNombre("");
    setDescripcion("");
    setEstado("activo");
    setAbierto(false);
  }

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        <Plus className="size-4" /> Nuevo proyecto
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={enviar} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Nuevo proyecto</DialogTitle>
            <DialogDescription>Se añade al cliente seleccionado.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="proyecto-nombre">Nombre *</Label>
            <Input id="proyecto-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="proyecto-descripcion">Descripción</Label>
            <Textarea
              id="proyecto-descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="proyecto-estado">Estado</Label>
            <select
              id="proyecto-estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value as EstadoProyecto)}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {(Object.keys(ESTADOS_PROYECTO) as EstadoProyecto[]).map((e) => (
                <option key={e} value={e}>
                  {ESTADOS_PROYECTO[e]}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button type="submit">Crear proyecto</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
