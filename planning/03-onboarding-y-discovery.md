# 03 · Onboarding, discovery y paso a entrega

## Propósito

Convertir un cliente ganado en un proyecto en marcha sin repetir la fase de venta. En agencias de IA, esto incluye un **discovery** y una **evaluación de madurez** antes de desarrollar. [Fuente 12, 13]

## Fases de referencia (agencias de IA)

1. **Discovery:** entrevistas con stakeholders, auditoría de datos e infraestructura, revisión del stack existente. [Fuente 12]
2. **Evaluación (assessment):** mapeo de casos de uso frente a viabilidad, datos disponibles, integración, requisitos regulatorios y ROI esperado. [Fuente 12]
3. **Prueba de concepto (PoC):** alcance estrecho, ligado a criterios de éxito definidos antes. Duración típica citada: 4–8 semanas, aunque las fuentes varían. [Fuente 12]
4. **Handoff:** documento de traspaso que permita empezar sin repetir el discovery. [Fuente 13]

Para desarrollo de software, el equivalente es el **discovery y scoping** previo al contrato. [Fuente 11, 14]

## Funcionalidades

| Funcionalidad | Descripción | Prioridad |
|---|---|---|
| Checklist de onboarding | Accesos, guías de marca, requisitos de seguimiento, fecha de kickoff | P0 |
| Creación automática del espacio del cliente | Al ganar un deal, se crean carpetas, canal y tareas base | P1 |
| Plantilla de discovery | Cuestionario de entrevista y checklist de auditoría de datos | P1 |
| Evaluación de madurez IA | Puntuación por dimensiones (datos, infraestructura, procesos, personas) | P2 |
| Matriz de casos de uso | Tabla de casos de uso con viabilidad, valor e impacto | P2 |
| Documento de handoff | Plantilla con alcance, decisiones, accesos (sin credenciales) y riesgos | P1 |
| Recogida de activos del cliente | Solicitud y seguimiento de documentos, datos y accesos | P1 |
| Hito de pago de discovery | Discovery como hito facturable separado | P2 |

## Flujos de trabajo

1. **Deal ganado → onboarding:** se crea el espacio del cliente, se envía el checklist y se programa el kickoff.
2. **Discovery → assessment:** las notas de entrevistas alimentan la matriz de casos de uso; el responsable aprueba los casos prioritarios.
3. **Assessment → PoC:** se define un criterio de éxito medible antes de empezar.
4. **PoC → handoff:** se genera el documento de traspaso y se crea el proyecto de entrega (ver 04).

## Consideraciones

- Un roadmap entregado en 2 semanas se considera señal de alerta por algunas fuentes; por eso el discovery debe tener duración y entregables definidos. [Fuente 12]
- La brecha entre PoC y producción es donde se estancan muchas iniciativas. El módulo debe registrar qué PoC pasó a producción y cuál no. [Fuente 12]
- **Cifra no verificada:** una fuente cita que el 88 % de las PoC de IA no llegan a despliegue masivo, atribuida a McKinsey en un blog de proveedor. No se ha comprobado; no usar como dato sin verificar. [Fuente 12]
- **Secretos:** el documento de handoff nunca debe contener credenciales. Se referencian en un gestor de secretos. (Ver [11-seguridad-y-cumplimiento.md](11-seguridad-y-cumplimiento.md).)
