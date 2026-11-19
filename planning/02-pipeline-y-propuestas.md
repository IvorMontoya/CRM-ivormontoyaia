# 02 · Pipeline de ventas y propuestas

## Propósito

Gestionar las oportunidades desde el primer contacto hasta el cierre, incluyendo la fase de scoping (cualificación y estimación) que en agencias de desarrollo y de IA es crítica para la rentabilidad.

## Etapas propuestas

1. **Lead entrante:** llega por formulario, referido o prospección.
2. **Cualificación (BANT):** presupuesto, autoridad, necesidad y plazo. [Fuente 10]
3. **Llamada de scoping:** entender el problema; no es todavía discovery técnico.
4. **Propuesta enviada.**
5. **Negociación.**
6. **Ganado** → genera onboarding y proyecto (ver 03 y 04).
7. **Perdido** (con motivo obligatorio).

## Funcionalidades

| Funcionalidad | Descripción | Prioridad |
|---|---|---|
| Pipeline en tablero (kanban) | Vista de oportunidades por etapa, con importe y probabilidad | P0 |
| Oportunidad | Vincula cuenta, contactos, importe estimado, fecha de cierre y responsable | P0 |
| Motivos de pérdida | Catálogo de motivos para análisis posterior | P0 |
| Cualificación guiada | Checklist BANT o personalizado antes de pasar a estimación | P1 |
| Estimación por bloques | Estimación de horas por rol (PM, desarrollo, IA/datos, QA) y tarifa | P1 |
| Plantillas de propuesta | Propuestas reutilizables que se rellenan con los datos del deal | P1 |
| Generación de SOW | Documento de alcance con entregables, criterios de aceptación y exclusiones | P1 |
| Versionado de propuestas | Historial de versiones y de envíos | P2 |
| Firma electrónica | Integración con un servicio de firma | P2 |
| Previsión (forecast) | Ingresos esperados por probabilidad y periodo | P2 |
| Descuentos y aprobaciones | Descuentos por encima de un umbral requieren aprobación | P2 |

## Flujos de trabajo

1. **Scoping:** el comercial completa la cualificación; si pasa, se crea una estimación con horas por rol. [Fuente 10, 11]
2. **Propuesta:** se elige plantilla, se rellenan alcance y precio, se envía; el sistema registra la apertura o el envío. [Fuente 7]
3. **Cierre:** al ganar, se convierte el deal en cuenta activa y se dispara el onboarding.
4. **Pérdida:** se registra el motivo y se programa, si procede, un recordatorio de seguimiento.

## Riesgos que el módulo debe mitigar

- **Subestimación en la venta:** el precio comercial suele quedar por debajo del coste real. Conviene que la estimación quede registrada y comparada con la entrega real. [Fuente 11]
- **Alcance no acotado:** cada línea del SOW debería tener entregable, límite, criterio de aceptación y condición de cambio. [Fuente 11]
- **Contingencia:** algunas fuentes sugieren un colchón del 15–30 % en precios cerrados; debe ser un parámetro, no una regla fija. [Fuente 11]

## Referencias de producto

Salesforce, HubSpot, Pipedrive, monday.com y Close cubren pipeline y propuestas. Las agencias usan además herramientas específicas de propuestas, que sugiere que la plantilla de propuesta y el SOW deben ser de primer nivel. [Fuente 1, 3, 5, 6]
