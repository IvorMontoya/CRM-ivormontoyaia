"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Building2, CheckCircle2, Plus, Trash2, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { ETAPAS_LEAD, type CamposLead, type EtapaLead, type Lead } from "@/lib/crm/tipos";

const ETAPAS = Object.keys(ETAPAS_LEAD) as EtapaLead[];
const formatoMoneda = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
const avisarFallo = () => toast.error("No se pudo guardar. Revisa la conexión e inténtalo de nuevo.");

const nombreCorto = (email: string) => email.split("@")[0] || email;

export function LeadsView() {
  const { datos, acciones } = useCrm();

  const totalPorEtapa = (etapa: EtapaLead) =>
    datos.leads.filter((l) => l.etapa === etapa).reduce((suma, l) => suma + (l.valorEstimado ?? 0), 0);

  async function cambiarEtapa(lead: Lead, etapa: EtapaLead) {
    try {
      await acciones.cambiarEtapaLead(lead.id, etapa);
    } catch {
      avisarFallo();
    }
  }

  async function eliminar(lead: Lead) {
    if (!window.confirm(`¿Eliminar el lead "${lead.nombreContacto}"?`)) return;
    try {
      await acciones.eliminarLead(lead.id);
      toast.success("Lead eliminado");
    } catch {
      avisarFallo();
    }
  }

  async function convertir(lead: Lead) {
    if (!window.confirm(`¿Crear un cliente con los datos de "${lead.nombreContacto}"?`)) return;
    try {
      await acciones.convertirLeadEnCliente(lead);
      toast.success("Lead convertido en cliente");
    } catch {
      avisarFallo();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
          <p className="text-sm text-muted-foreground">
            Oportunidades desde el primer contacto hasta el cierre. Cambia el lead de etapa según avance.
          </p>
        </div>
        <NuevoLeadDialog />
      </div>

      {datos.leads.length === 0 && (
        <p className="text-sm text-muted-foreground">Todavía no hay leads. Crea el primero con el botón de arriba.</p>
      )}

      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 md:-mx-6 md:px-6">
        {ETAPAS.map((etapa) => {
          const leads = datos.leads.filter((l) => l.etapa === etapa);
          return (
            <section key={etapa} className="flex w-72 shrink-0 flex-col gap-3">
              <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  {ETAPAS_LEAD[etapa]}
                  <Badge variant="secondary">{leads.length}</Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {totalPorEtapa(etapa) > 0 ? formatoMoneda.format(totalPorEtapa(etapa)) : ""}
                </span>
              </div>

              {leads.map((lead) => (
                <Card key={lead.id} className="border-foreground/15">
                  <CardContent className="space-y-3 p-4">
                    <div className="space-y-1">
                      <p className="truncate font-medium">{lead.nombreContacto}</p>
                      {lead.empresa && (
                        <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                          <Building2 className="size-3.5 shrink-0" /> {lead.empresa}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {lead.valorEstimado != null && (
                        <span className="font-medium text-foreground">{formatoMoneda.format(lead.valorEstimado)}</span>
                      )}
                      {lead.origen && <span>· {lead.origen}</span>}
                      {lead.responsable && (
                        <span className="flex items-center gap-1">
                          <UserRound className="size-3.5" /> {nombreCorto(lead.responsable)}
                        </span>
                      )}
                    </div>

                    <select
                      aria-label={`Etapa de ${lead.nombreContacto}`}
                      value={lead.etapa}
                      onChange={(e) => void cambiarEtapa(lead, e.target.value as EtapaLead)}
                      className="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {ETAPAS.map((e) => (
                        <option key={e} value={e}>
                          {ETAPAS_LEAD[e]}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center justify-between gap-2">
                      {lead.clienteId ? (
                        <Badge variant="outline" className="gap-1">
                          <CheckCircle2 className="size-3" /> Cliente creado
                        </Badge>
                      ) : lead.etapa === "ganado" ? (
                        <Button size="sm" variant="outline" onClick={() => void convertir(lead)}>
                          Crear cliente
                        </Button>
                      ) : (
                        <span />
                      )}
                      <Button variant="ghost" size="icon" className="size-8" onClick={() => void eliminar(lead)} aria-label="Eliminar lead">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function NuevoLeadDialog() {
  const { datos, acciones } = useCrm();
  const { usuario } = useAuth();
  const emailUsuario = usuario?.email ?? "";

  const [abierto, setAbierto] = useState(false);
  const [nombreContacto, setNombreContacto] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [origen, setOrigen] = useState("");
  const [valor, setValor] = useState("");
  const [responsable, setResponsable] = useState(emailUsuario);
  const [etapa, setEtapa] = useState<EtapaLead>("nuevo");
  const [notas, setNotas] = useState("");

  function limpiar() {
    setNombreContacto("");
    setEmpresa("");
    setEmail("");
    setTelefono("");
    setOrigen("");
    setValor("");
    setResponsable(emailUsuario);
    setEtapa("nuevo");
    setNotas("");
  }

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nombre = nombreContacto.trim();
    if (!nombre) return;

    const monto = valor.trim() === "" ? null : Number(valor.replace(",", "."));
    if (monto !== null && (!Number.isFinite(monto) || monto < 0)) {
      toast.error("El valor estimado debe ser un número mayor o igual que 0");
      return;
    }

    const campos: CamposLead = {
      nombreContacto: nombre,
      empresa: empresa.trim(),
      email: email.trim(),
      telefono: telefono.trim(),
      origen: origen.trim(),
      valorEstimado: monto,
      responsable: responsable || emailUsuario,
      etapa,
      notas: notas.trim(),
    };

    try {
      await acciones.crearLead(campos);
      toast.success(`Lead "${nombre}" creado`);
      limpiar();
      setAbierto(false);
    } catch {
      avisarFallo();
    }
  }

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger render={<Button />}>
        <Plus className="size-4" /> Nuevo lead
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <form onSubmit={enviar} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Nuevo lead</DialogTitle>
            <DialogDescription>Lo verá todo el equipo de la agencia.</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="lead-nombre">Nombre de contacto *</Label>
            <Input id="lead-nombre" value={nombreContacto} onChange={(e) => setNombreContacto(e.target.value)} required />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lead-empresa">Empresa</Label>
              <Input id="lead-empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-origen">Origen</Label>
              <Input id="lead-origen" placeholder="Web, referido, evento..." value={origen} onChange={(e) => setOrigen(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-email">Email</Label>
              <Input id="lead-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-telefono">Teléfono</Label>
              <Input id="lead-telefono" type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-valor">Valor estimado (€)</Label>
              <Input id="lead-valor" inputMode="decimal" placeholder="Ej. 3000" value={valor} onChange={(e) => setValor(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-etapa">Etapa</Label>
              <select
                id="lead-etapa"
                value={etapa}
                onChange={(e) => setEtapa(e.target.value as EtapaLead)}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {ETAPAS.map((e) => (
                  <option key={e} value={e}>
                    {ETAPAS_LEAD[e]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-responsable">Responsable</Label>
            <select
              id="lead-responsable"
              value={responsable}
              onChange={(e) => setResponsable(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {datos.miembros.map((m) => (
                <option key={m.email} value={m.email}>
                  {m.email}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-notas">Notas</Label>
            <Textarea id="lead-notas" rows={3} value={notas} onChange={(e) => setNotas(e.target.value)} />
          </div>

          <DialogFooter>
            <Button type="submit">Crear lead</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
