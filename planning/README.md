# Planificación funcional del CRM para agencias de IA

> **Estado:** investigación y planificación. **No hay código implementado.** Las prioridades son propuestas que el responsable del proyecto debe aprobar antes de implementar.

## Índice

| Archivo | Área funcional |
|---|---|
| [01-clientes-y-contactos.md](01-clientes-y-contactos.md) | Cuentas, contactos, historial y espacios por cliente |
| [02-pipeline-y-propuestas.md](02-pipeline-y-propuestas.md) | Embudo de ventas, scoping, propuestas y SOW |
| [03-onboarding-y-discovery.md](03-onboarding-y-discovery.md) | Paso de venta a entrega: discovery, readiness y kickoff |
| [04-proyectos-y-entregas.md](04-proyectos-y-entregas.md) | Proyectos, tareas, hitos, entregables y control de alcance |
| [05-tiempo-facturacion-y-costes-ia.md](05-tiempo-facturacion-y-costes-ia.md) | Registro de tiempo, retainers, facturación y coste de tokens |
| [06-catalogo-y-agentes-ia.md](06-catalogo-y-agentes-ia.md) | Catálogo de soluciones de IA, agentes, evaluaciones y versiones |
| [07-portal-cliente.md](07-portal-cliente.md) | Portal del cliente: visibilidad, aprobaciones y documentos |
| [08-usuarios-roles-y-permisos.md](08-usuarios-roles-y-permisos.md) | Autenticación, roles, multi-cliente y permisos |
| [09-automatizaciones-e-integraciones.md](09-automatizaciones-e-integraciones.md) | Workflows, recordatorios, IA asistiva e integraciones |
| [10-reportes-y-analitica.md](10-reportes-y-analitica.md) | Dashboards, métricas de negocio y de entrega |
| [11-seguridad-y-cumplimiento.md](11-seguridad-y-cumplimiento.md) | RGPD, auditoría, retención, AI Act y reglas de seguridad |
| [12-arquitectura-firebase-orientativa.md](12-arquitectura-firebase-orientativa.md) | Consideraciones de datos en Firebase (no es un diseño cerrado) |
| [13-fuentes.md](13-fuentes.md) | Fuentes consultadas, con enlaces y nivel de fiabilidad |
| [14-priorizacion.md](14-priorizacion.md) | Propuesta de fases MVP, con dependencias |

## Cómo leer esta documentación

- **Prioridad P0:** imprescindible para el primer uso real del CRM.
- **P1:** necesario para operar una agencia completa; se añade tras el MVP.
- **P2:** mejora de eficiencia o escala.
- **P3:** exploratorio; solo si hay demanda real.

Cada archivo incluye: propósito, funcionalidades, flujos de trabajo, prioridad y referencias. Las fuentes están numeradas en [13-fuentes.md](13-fuentes.md).

## Hallazgos transversales

1. **Las plataformas existentes son mayormente generalistas.** HubSpot, Pipedrive, monday.com o Zoho cubren ventas, pero casi ningún producto de referencia cubre bien a la vez el ciclo de venta, la entrega de proyectos y el consumo de IA (tokens, agentes, evaluaciones). Esa combinación es el hueco que puede cubrir un CRM propio. [Fuente 1, 2, 5]
2. **Las agencias de desarrollo conectan venta con entrega.** Un deal ganado debería generar un proyecto con plantilla, responsables y fechas. Varias fuentes lo señalan como el flujo más valioso. [Fuente 7, 9]
3. **El tiempo y el dinero se controlan a nivel de cliente.** Retainers con horas mensuales, hitos y facturación por uso necesitan los mismos datos. [Fuente 13, 14]
4. **El coste de IA es un dato de negocio nuevo.** Las agencias de IA necesitan atribuir tokens y llamadas a cada cliente para facturarlos o medir su margen. Ninguna herramienta generalista lo hace de forma nativa. [Fuente 15, 16]
5. **La seguridad y el cumplimiento deben estar en el diseño.** Sobre todo, las reglas de Firebase y la trazabilidad de cambios. [Fuente 19, 20, 21]
6. **Hay que validar con usuarios reales.** Las fuentes son sobre todo de proveedores. Conviene entrevistar a entre 3 y 5 agencias antes de cerrar prioridades.

## Decisiones que requieren aprobación

- Alcance del MVP (ver [14-priorizacion.md](14-priorizacion.md)).
- Si el CRM gestiona también facturación real o solo exporta datos a un sistema contable.
- Si el coste de IA se mide por proxy propio o se importa desde los proveedores.
- Idioma de la interfaz y del código.
