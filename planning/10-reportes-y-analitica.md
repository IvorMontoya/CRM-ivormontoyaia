# 10 · Reportes y analítica

## Propósito

Responder a las preguntas de gestión de la agencia: qué se vende, qué se entrega, cuánto se gana y en qué clientes se pierde margen.

## Dashboards propuestos

| Dashboard | Métricas principales | Usuarios | Prioridad |
|---|---|---|---|
| Comercial | Pipeline por etapa, valor ponderado, tasa de conversión, ciclo medio de venta | Comerciales, administración | P1 |
| Motivos de pérdida | Distribución de motivos, por periodo y por sector | Administración | P2 |
| Entrega | Proyectos en plazo, hitos vencidos, cambios de alcance por proyecto | Gestores de proyecto | P1 |
| Rentabilidad | Horas estimadas frente a reales, margen por proyecto y por cliente | Administración, finanzas | P2 |
| Retainers | Consumo de horas, burn rate, meses por encima o por debajo | Gestores, finanzas | P1 |
| Coste de IA | Tokens y coste por cliente, modelo y solución; margen frente al precio | Administración, responsables técnicos | P2 |
| Salud de cuentas | Actividad reciente, aprobaciones pendientes, incidencias abiertas | Responsables de cuenta | P2 |

## Métricas sugeridas

- **Venta:** tasa de cierre por etapa, tiempo medio en cada etapa, valor medio de propuesta.
- **Entrega:** porcentaje de hitos a tiempo, número de cambios por proyecto, horas desviadas.
- **Negocio:** margen por proyecto, ingresos recurrentes, cliente con mayor dependencia.
- **IA:** coste por consulta, tasa de regresión entre versiones, incidentes por solución.

> Las fuentes no ofrecen benchmarks independientes de estas métricas. Conviene fijar objetivos internos tras los primeros meses de uso. [Fuente 2, 6]

## Consideraciones

- Los dashboards de rentabilidad son sensibles. Solo deben ver los roles de administración y finanzas (ver 08).
- Los datos agregados deben poder calcularse sin recorrer todos los documentos; ver el diseño orientativo en 12.
