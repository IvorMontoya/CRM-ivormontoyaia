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

## 4. Decisiones pendientes

- [ ] Framework de frontend y de servidor.
- [ ] Firestore frente a Realtime Database.
- [ ] Modelo de roles y permisos.
- [ ] Idioma del código (nombres de variables y módulos).
- [ ] Estrategia de pruebas.
- [ ] Licencia del repositorio.

## 5. Registro de cambios de arquitectura

| Fecha | Cambio | Motivo |
|---|---|---|
| 2026-11-19 | Creación del documento | Fase 0: estructura inicial |
