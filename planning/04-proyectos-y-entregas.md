# 04 · Proyectos y entregas

## Propósito

Ejecutar y controlar el trabajo contratado: tareas, hitos, entregables, responsables y alcance. Es el módulo que conecta la venta con la facturación y el tiempo.

## Funcionalidades

| Funcionalidad | Descripción | Prioridad |
|---|---|---|
| Proyecto vinculado al cliente y al deal | Creado a partir del deal ganado, con referencia al SOW | P0 |
| Plantillas de proyecto | Plantillas por tipo de servicio (chatbot, automatización, RAG, consultoría de datos) | P1 |
| Tareas y subtareas | Responsable, estado, prioridad, fecha límite y dependencias | P0 |
| Hitos | Fechas y criterios de aceptación; ligados a facturación si aplica | P0 |
| Entregables | Artefactos entregados (código, modelo, documentación, informe) con versión y estado de aprobación | P0 |
| Estado del proyecto | Salud (en plazo, en riesgo, bloqueado) calculada o declarada | P1 |
| Control de alcance | Solicitudes de cambio con impacto en horas y coste; aprobación del cliente | P1 |
| Riesgos y bloqueos | Registro con responsable y plan de mitigación | P2 |
| Vista de calendario y carga de equipo | Asignación de personas por semana | P2 |
| Documentación del proyecto | Enlaces a repositorios, entornos, decisiones (ADR) y runbooks | P1 |
| Retrospectiva | Plantilla de cierre con lecciones aprendidas | P3 |

## Flujos de trabajo

1. **Creación:** deal ganado → proyecto con plantilla → tareas base → hitos según el SOW.
2. **Ejecución:** se actualizan tareas y horas; los hitos cambian a "listo para revisión" y luego a "aceptado" por el cliente.
3. **Solicitud de cambio:** se registra la petición, se estima impacto y se aprueba o rechaza; si se aprueba, se actualiza el SOW. [Fuente 11]
4. **Cierre:** se entregan los artefactos finales, se archiva el proyecto y se registra el margen real frente al estimado.

## Reglas de negocio sugeridas

- Una solicitud que no avanza el resultado acordado va a un **change order**, no al presupuesto actual. [Fuente 11]
- Cada entregable debe tener criterio de aceptación definido antes de empezar.
- Los proyectos de IA necesitan un registro de versiones de modelo y de prompt por entrega (ver [06-catalogo-y-agentes-ia.md](06-catalogo-y-agentes-ia.md)).

## Referencias

Productos como Bitrix24, Agiled y Productive vinculan proyectos a deals ganados y a facturación. Agiled, por ejemplo, incluye aprobaciones y actividad en el portal de cliente. [Fuente 6, 7, 9]
