# Arquitectura del CRM

> **Estado:** borrador de fase 0. Las decisiones marcadas como *pendientes* se definirán antes de implementar funcionalidades.

## 1. Principios

- **Modular:** cada funcionalidad vive en su propio módulo con una interfaz clara.
- **Escalable:** se pueden añadir módulos sin reescribir los existentes.
- **Segura por defecto:** autenticación obligatoria, reglas de Firebase restrictivas y mínimo privilegio.
- **Documentada:** cada decisión importante queda registrada aquí.

## 2. Infraestructura

| Servicio | Uso previsto | Estado |
|---|---|---|
| Firebase Authentication | Inicio de sesión de usuarios del CRM | Pendiente |
| Firestore (o Realtime Database) | Datos de clientes, oportunidades y actividad | Pendiente de decidir |
| Firebase Storage | Documentos y archivos adjuntos | Pendiente |
| Firebase Security Rules | Control de acceso a datos y archivos | Pendiente |

## 3. Módulos

Lista provisional. Se confirmará con el responsable del proyecto antes de implementar.

- *Pendiente:* definir módulos (por ejemplo: clientes, oportunidades, proyectos, actividad, usuarios y roles).

## 4. Decisiones aprobadas

| Tema | Decisión | Motivo |
|---|---|---|
| Alcance | CRM para **una sola agencia** | Simplifica el diseño; se mantiene el aislamiento por cliente para el portal |
| Idioma | **Español** (interfaz, documentación y nombres de dominio como `clientes`, `proyectos`); términos técnicos en inglés cuando sean estándar (`auth`, `token`) | Decisión del responsable |
| Frontend | **React + TypeScript + Vite** | CRM detrás de inicio de sesión; no necesita renderizado en servidor |
| Datos y acceso | **Firebase Authentication + Cloud Firestore** | Infraestructura elegida para el proyecto |
| Lógica de servidor | **Cloud Functions** | Automatizaciones, cálculos de uso e integraciones |
| Facturación | **Dentro del CRM.** Fase 1: facturas desde horas, retainers e hitos con numeración correlativa, impuestos y PDF. Fase 2: cobro con un proveedor de pagos (p. ej. Stripe) | Decisión del responsable; no se construye procesamiento de pagos propio |
| Medición de tokens (fase 3) | **Registro en código propio:** cada llamada a un modelo guarda un evento de uso (cliente, proyecto, modelo, tokens de entrada y salida, coste) en Firestore. Tabla de precios por modelo con fecha de vigencia. Conciliación mensual con el panel del proveedor | Las soluciones las construye la agencia; no hace falta un proxy |
| Licencia | **Pendiente de añadir el archivo `LICENSE`.** Recomendada: AGPL-3.0 | Sin licencia, el código público no puede usarse legalmente; el texto debe tomarse de una fuente verificada |

## 5. Decisiones pendientes

- [ ] Firestore frente a Realtime Database. (Recomendado: Firestore, ya reflejado en la documentación de planificación.)
- [ ] Modelo de roles y permisos (detalle en `planning/08-usuarios-roles-y-permisos.md`).
- [ ] Estrategia de pruebas (reglas de Firestore y lógica de negocio).
- [ ] Añadir el archivo `LICENSE` con la licencia elegida.
- [ ] Revisar obligaciones de facturación fiscal del país de la agencia (requisitos de software de facturación).

## 6. Registro de cambios de arquitectura

| Fecha | Cambio | Motivo |
|---|---|---|
| 2026-11-19 | Creación del documento | Fase 0: estructura inicial |
| 2026-11-19 | Decisiones aprobadas: alcance, idioma, stack, facturación, medición de tokens y licencia recomendada | Confirmación del responsable |
