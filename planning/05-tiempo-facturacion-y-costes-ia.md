# 05 · Tiempo, facturación y costes de IA

## Propósito

Registrar el tiempo dedicado, facturar según el modelo contratado (proyecto, retainer, hitos, uso) y, en agencias de IA, atribuir el **coste de tokens y llamadas a modelos** a cada cliente.

## Funcionalidades

| Funcionalidad | Descripción | Prioridad |
|---|---|---|
| Registro de tiempo | Temporizador o entrada manual por tarea, con nota obligatoria | P0 |
| Aprobación de tiempo | El responsable del proyecto aprueba antes de facturar | P1 |
| Tarifas por rol y cliente | Tarifas base con excepciones por cliente | P1 |
| Retainer | Bolsa mensual de horas con consumo en tiempo real y "burn rate" | P1 |
| Facturación por hitos | Factura al aceptarse un hito | P1 |
| Facturación por tiempo y materiales | Factura agregada desde el registro de horas | P1 |
| Facturación por uso (IA) | Cargo según tokens, llamadas o minutos de agente, con margen configurable | P2 |
| Atribución de coste IA por cliente | Registro de tokens por cliente, modelo y proyecto | P1 |
| Límites de gasto | Alertas o bloqueos al superar un presupuesto de IA por cliente | P2 |
| Exportación a contabilidad | CSV o API hacia el sistema contable | P1 |
| Integración con pasarela de pago | Cobro en línea mediante un proveedor de pagos | P3 |

## Cómo atribuir el coste de IA

Las fuentes describen varios métodos, todos con compromisos. [Fuente 15, 16]

1. **Clave de API por cliente o flujo:** el proveedor factura por clave; sencillo, pero requiere gestionar muchas claves.
2. **Proxy propio:** cada petición pasa por un servicio propio que registra tokens antes de reenviarla. Da control total, pero es un punto crítico de disponibilidad y de seguridad.
3. **Importación de uso desde el proveedor:** se leen los informes de uso y se asignan a clientes por etiqueta. Menos control en tiempo real.
4. **Pasarela de facturación con medición:** un proveedor de facturación mide el uso y cobra (ejemplo citado: Stripe con un cliente de IA). [Fuente 17]

La recomendación inicial es la **opción 3** para el MVP y evaluar la **opción 2** cuando haya volumen. Hay que decidirlo antes de implementar.

## Flujos de trabajo

1. **Registro diario:** el equipo imputa horas por tarea; el sistema calcula el consumo del retainer.
2. **Fin de mes:** se generan facturas por retainer, hitos y tiempo; las horas no aprobadas quedan marcadas.
3. **Uso de IA:** se registra el consumo por cliente; se compara con el presupuesto y con el precio cobrado para medir margen.

## Referencias de producto

HighLevel muestra uso de IA por subcuenta, con tokens de entrada y salida y el cargo bruto frente al importe realmente cobrado. Ninjacat tiene pestañas separadas de uso, facturación y límites diarios. [Fuente 15, 16]

## Nota de alcance

Para el MVP conviene **no** construir un motor de facturación completo. Lo razonable es registrar tiempo y uso, y exportar a la herramienta contable que use la agencia. Confirmar con el responsable.
