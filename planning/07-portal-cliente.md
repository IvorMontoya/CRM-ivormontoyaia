# 07 · Portal del cliente

## Propósito

Dar al cliente visibilidad sobre su proyecto, sus facturas y sus documentos, y permitirle aprobar entregables sin depender de emails. Es una característica frecuente en las herramientas de agencias. [Fuente 7, 8, 28]

## Funcionalidades

| Funcionalidad | Descripción | Prioridad |
|---|---|---|
| Acceso por invitación | Cuentas de cliente creadas por la agencia; sin registro abierto | P1 |
| Estado del proyecto | Hitos, fechas y estado; sin datos internos (horas de coste, márgenes) | P1 |
| Documentos compartidos | Propuestas, SOW y entregables con versión | P1 |
| Aprobaciones | Aceptar o rechazar un hito o entregable, con comentario y registro | P1 |
| Facturas y pagos | Visualización de facturas emitidas | P2 |
| Solicitud de cambio | El cliente pide un cambio que entra en el flujo de aprobación | P2 |
| Mensajería | Hilo ligado al proyecto o al entregable | P2 |
| Carga de activos | El cliente sube datos o accesos requeridos en el onboarding | P2 |

## Reglas de seguridad

- El portal **nunca** expone registros internos: notas, tarifas, márgenes, tiempo sin aprobar ni otros clientes. [Fuente 7]
- Cada cuenta de cliente solo ve sus propios datos (ver 08).
- Las aprobaciones registran quién, cuándo y qué versión, para que tengan valor probatorio.

## Consideraciones

- Una fuente señala como defecto de algunas herramientas que el portal no muestra los registros del proyecto; conviene probarlo antes de elegir. [Fuente 28]
- Un portal que solo muestra PDF sin estado pierde la mayor parte de su utilidad.
