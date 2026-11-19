# 14 · Priorización y fases propuestas

> Propuesta para revisión. No se implementa nada hasta aprobación expresa.

## Fase 1 · MVP (base operativa)

Objetivo: que la agencia pueda registrar clientes, vender y arrancar un proyecto.

- Autenticación y roles básicos (08).
- Clientes y contactos con historial simple (01).
- Pipeline en tablero, motivos de pérdida y cualificación básica (02).
- Proyecto creado a partir de un deal ganado, con tareas, hitos y entregables (04).
- Registro de tiempo por tarea (05).
- Facturas desde horas aprobadas, con numeración correlativa, impuestos y PDF (05). Decisión aprobada: la facturación vive en el CRM.
- Recordatorios de seguimiento (09).
- Reglas de seguridad restrictivas y tests (11).
- Exportación de datos a CSV (01, 05).

## Fase 2 · Operación completa

- Propuestas con plantilla y SOW (02).
- Onboarding y checklist de discovery (03).
- Retainers y facturación por hitos (05).
- Portal de cliente con aprobaciones (07).
- Dashboards comercial, entrega y retainers (10).
- Auditoría de cambios y de accesos (11).
- Campos personalizados y workspaces por cliente (01).

## Fase 3 · Agencia de IA

- Catálogo de soluciones, modelos y prompts versionados (06).
- Atribución de coste de IA por cliente (05).
- Evaluaciones y registro de incidentes (06).
- Panel de coste y margen de IA (10).
- Asistentes de IA dentro del CRM con aprobación humana (09).

## Fase 4 · Escala y madurez

- Motor de reglas de automatización (09).
- Integraciones avanzadas: calendario, repositorios, firma, contabilidad (09).
- Previsión de ingresos y aprobaciones de descuentos (02).
- Detección de riesgo de cliente (09).
- Estimaciones con colchón de contingencia y comparación con la realidad (02, 10).

## Dependencias clave

```
Usuarios y roles ──► Clientes ──► Pipeline ──► Proyecto ──► Tiempo ──► Facturación
                                      │             │
                                      └──► Onboarding ┘──► Portal de cliente
                                                    │
                                              Catálogo IA ──► Coste IA ──► Margen
```

## Decisiones aprobadas

1. **Alcance:** una sola agencia (ver 12).
2. **Facturación:** dentro del CRM; cobro con proveedor de pagos en la fase 2 (05).
3. **Medición de tokens (fase 3):** registro en código propio con tabla de precios y conciliación mensual (05).
4. **Idioma:** español.
5. **Stack:** React + TypeScript + Vite; Firebase Auth y Firestore; Cloud Functions (ver `docs/ARQUITECTURA.md`).
6. **Licencia:** AGPL-3.0 (archivo `LICENSE`).

## Validación recomendada

Antes de cerrar la fase 1, entrevistar a 3–5 agencias (de IA y de desarrollo) para confirmar prioridades. Las fuentes consultadas son sobre todo de proveedores y no sustituyen a esa validación. Ver `13-fuentes.md`, sección "Fuentes que faltan".
