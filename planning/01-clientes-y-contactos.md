# 01 · Clientes y contactos

## Propósito

Centralizar la información de cada cliente (empresa), sus personas de contacto y todo el historial de interacciones. Es la base sobre la que se apoyan el resto de módulos.

## Funcionalidades

| Funcionalidad | Descripción | Prioridad |
|---|---|---|
| Ficha de cliente (cuenta) | Datos fiscales, sector, tamaño, dirección, web, responsable interno, estado (prospecto, activo, pausado, cerrado) | P0 |
| Contactos asociados | Personas por cuenta, con rol (decisor, técnico, financiero), cargo y preferencias de comunicación | P0 |
| Historial de actividad | Línea temporal con emails, llamadas, reuniones, notas y cambios de estado | P0 |
| Notas y menciones | Notas internas con menciones a miembros del equipo | P0 |
| Campos personalizados | Campos configurables por la agencia (por ejemplo, "stack tecnológico del cliente") | P1 |
| Espacio por cliente (workspace) | Agrupación de pipeline, documentos, proyectos y permisos aislados por cliente | P1 |
| Deduplicación | Detección de cuentas o contactos duplicados por dominio o email | P2 |
| Importación y exportación | CSV para migrar desde hojas de cálculo u otras herramientas | P1 |
| Relaciones entre cuentas | Empresa matriz, filiales, partners | P3 |

## Flujos de trabajo

1. **Alta de cliente:** se crea la cuenta, se asigna responsable, se añaden contactos y se registra el origen (referido, web, evento).
2. **Registro de interacción:** un miembro del equipo registra una llamada o reunión; la actividad queda vinculada a la cuenta y al contacto.
3. **Cambio de estado:** pasar de prospecto a cliente activo dispara la creación del espacio del cliente (ver [03-onboarding-y-discovery.md](03-onboarding-y-discovery.md)).

## Consideraciones

- Las agencias suelen trabajar con varias personas por cliente y necesitan saber quién es el interlocutor principal. [Fuente 1, 2]
- El espacio aislado por cliente (contactos, pipeline, permisos) es una diferencia clave frente a CRMs genéricos. [Fuente 1]
- El historial de actividad debe ser inmutable o, como mínimo, auditable (ver [11-seguridad-y-cumplimiento.md](11-seguridad-y-cumplimiento.md)).
- **Datos personales:** los contactos son datos personales en el sentido del RGPD. Hay que registrar la base legal y el periodo de conservación por tipo de dato. [Fuente 19, 20]
