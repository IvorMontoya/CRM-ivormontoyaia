# 09 · Automatizaciones, workflows e integraciones

## Propósito

Reducir el trabajo manual de seguimiento y de traspaso entre fases, y conectar el CRM con las herramientas que ya usa la agencia. Las fuentes insisten en que la automatización de recordatorios y de traspasos es uno de los mayores beneficios. [Fuente 2, 9]

## Automatizaciones

| Funcionalidad | Descripción | Prioridad |
|---|---|---|
| Recordatorios de seguimiento | Tareas automáticas tras una propuesta sin respuesta | P0 |
| Creación de proyecto al ganar | Deal ganado → proyecto con plantilla | P1 |
| Checklist de onboarding | Tareas y documentos generados al crear un cliente | P1 |
| Alertas de hitos | Aviso al responsable cuando un hito vence | P1 |
| Alertas de presupuesto | Aviso al superar un porcentaje del retainer o del presupuesto de IA | P1 |
| Detección de riesgo de cliente | Señal de posible pérdida (sin respuesta, cambio de tono, caída de uso) | P3 |
| Reglas configurables | Motor de reglas "si X entonces Y" administrado por la agencia | P2 |

## IA asistiva dentro del CRM

Las herramientas actuales ofrecen redactar emails, resumir llamadas, enriquecer registros y marcar riesgos. Conviene distinguir entre **asistentes** (sugieren, la persona decide) y **agentes** (ejecutan acciones). Para el MVP, solo asistentes con aprobación humana. [Fuente 1]

| Funcionalidad | Prioridad |
|---|---|
| Resumen de reunión a partir de notas | P2 |
| Borrador de propuesta a partir de la estimación | P2 |
| Enriquecimiento de cuenta (con fuentes verificables) | P3 |
| Agentes con acciones automáticas sobre clientes | P3, requiere revisión de seguridad |

## Integraciones

| Integración | Uso | Prioridad |
|---|---|---|
| Correo electrónico | Registro de emails y envío de propuestas | P1 |
| Calendario | Reuniones vinculadas a cuentas | P1 |
| Repositorios de código | Enlaces a PR y commits por proyecto | P2 |
| Herramienta contable | Exportación de facturas y de horas | P1 |
| Firma electrónica | Firma de SOW | P2 |
| Proveedores de modelos de IA | Lectura de uso y coste | P1 |
| Webhooks y API propia | Conexión con sistemas de la agencia | P2 |
| Importación desde otros CRM | Migración inicial de datos | P1 |

## Consideraciones

- Cada integración es un punto de fuga de datos. Hay que documentar qué datos envía, con qué base legal y con qué acuerdo de tratamiento. [Fuente 19, 20]
- Las credenciales de integración se guardan como secretos del servidor, nunca en el cliente ni en el repositorio.
- Las automatizaciones deben ser auditables: qué regla se ejecutó, sobre qué registro y con qué resultado.
