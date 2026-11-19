# 06 · Catálogo de soluciones y agentes de IA

## Propósito

Módulo específico de agencias de IA: registrar qué soluciones se han construido o se están construyendo para cada cliente, con sus modelos, prompts, agentes, evaluaciones y versiones. Es el diferencial frente a un CRM genérico.

> **Nota de investigación:** las búsquedas no encontraron productos de CRM que cubran este módulo de forma nativa. Es una propuesta basada en las prácticas de consultoría de IA y en la necesidad de trazabilidad. [Fuente 12, 13]

## Entidades principales

- **Solución:** caso de uso entregado a un cliente (por ejemplo, asistente de atención, clasificación de documentos).
- **Agente:** componente autónomo o semiautónomo con herramientas, permisos y un objetivo definido.
- **Modelo:** proveedor, nombre, versión y parámetros usados.
- **Prompt / plantilla:** versión, autor, fecha y evaluaciones asociadas.
- **Evaluación:** conjunto de casos de prueba, métricas y resultados por versión.
- **Despliegue:** entorno (pruebas, producción), fecha y responsable.
- **Incidencia:** fallo, alucinación o incidente de seguridad, con su impacto.

## Funcionalidades

| Funcionalidad | Descripción | Prioridad |
|---|---|---|
| Ficha de solución | Cliente, objetivo, datos utilizados, estado (PoC, producción, retirada) | P1 |
| Registro de modelos y proveedores | Modelo, versión y coste por token asociados a cada solución | P1 |
| Registro de prompts versionados | Historial de cambios con motivo | P2 |
| Registro de agentes | Herramientas, permisos y límites de acción de cada agente | P2 |
| Evaluaciones | Casos de prueba y resultados por versión; regresiones | P2 |
| Aprobación humana | Registro de quién aprueba cada salida o despliegue | P1 |
| Registro de incidentes | Alucinaciones, fugas de datos y errores con clasificación | P2 |
| Biblioteca de plantillas de solución | Soluciones reutilizables como punto de partida | P3 |
| Datos de entrenamiento y fuentes | Inventario de datasets y de documentos indexados por cliente | P2 |

## Flujos de trabajo

1. **PoC → producción:** la solución pasa de PoC a producción solo si las evaluaciones cumplen el criterio definido en el discovery (ver 03).
2. **Cambio de modelo:** se registra la nueva versión, se ejecutan las evaluaciones y se documenta la decisión.
3. **Incidente:** se registra, se asigna y se vincula a la versión afectada.

## Consideraciones

- El registro de versiones de modelo y prompt es necesario para explicar qué sistema produjo qué resultado. Es relevante para el AI Act en sistemas de alto riesgo. [Fuente 21, 25]
- **Secretos:** las claves de proveedores de modelos nunca se guardan en el CRM. Se referencian en un gestor de secretos.
- **Datos del cliente:** los prompts y las evaluaciones pueden contener datos personales. Aplicar la misma política de retención que al resto de datos (ver 11).
