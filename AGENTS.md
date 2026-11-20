# Instrucciones para agentes de IA

Este archivo es de lectura obligatoria para cualquier agente de IA que participe en el desarrollo de este proyecto. Revísalo antes de realizar cambios importantes.

## 1. Contexto del proyecto

- Es un CRM personalizado para agencias de inteligencia artificial.
- El repositorio es **público**. Todo lo que se publique puede ser visto, copiado e indexado.
- El desarrollo se hace **por fases**. Fase 1 aprobada y en curso: landing, inicio de sesión con usuario y contraseña, panel con menú lateral y pestaña **Clientes** (clientes → proyectos → comentarios, guardados en el navegador).
- **No implementes módulos nuevos** (facturación, costes de IA, portal, etc.) sin aprobación expresa del responsable del proyecto. Cada pestaña nueva se aprueba antes de desarrollarla.

## 1b. Reglas de desarrollo (Next.js y shadcn)

- **Next.js 16 tiene cambios importantes.** Antes de escribir código de Next, lee la guía correspondiente en `node_modules/next/dist/docs/`. No te bases solo en la memoria del entrenamiento.
- La app es una **exportación estática** (`output: "export"`): no añadas rutas dinámicas sin `generateStaticParams`, ni Server Actions, ni route handlers, ni middleware. Eso requiere cambiar primero la arquitectura.
- Los componentes de **shadcn/ui** de este proyecto usan **Base UI**: para cambiar el elemento que renderiza un componente se usa la prop `render` (p. ej. `<Button render={<Link href="/" />}>`), no `asChild`.
- La protección de rutas del panel se hace en cliente (`src/app/panel/layout.tsx`). Eso es una comodidad de interfaz, no seguridad: la seguridad real depende de las reglas de Firebase cuando existan datos en Firestore.
- Antes de dar algo por bueno: `npx tsc --noEmit`, `npm run lint` y `npm run build`.

## 2. Infraestructura: Firebase

- La infraestructura del proyecto usa **Firebase**: **Firebase Authentication** para el acceso, **Cloud Firestore** como base de datos y **Cloud Functions** para lógica de servidor. Firebase Storage se añadirá cuando un módulo lo necesite. Detalle en `docs/ARQUITECTURA.md`.
- Antes de añadir un servicio de Firebase nuevo, documenta su propósito y su impacto en seguridad en `docs/ARQUITECTURA.md`.
- Las **reglas de seguridad de Firebase** (Firestore, Storage, etc.) son parte del código del proyecto. Deben versionarse, revisarse y probarse. Nunca dejes reglas abiertas del tipo `allow read, write: if true`.

### Configuración pública frente a credenciales privadas

| Tipo | Ejemplos | ¿Se puede publicar? |
|---|---|---|
| Configuración pública del SDK cliente | `apiKey`, `authDomain`, `projectId`, `appId` | Sí, pero se gestiona por variables de entorno para facilitar cambios de entorno. La seguridad real depende de las reglas de Firebase, no de ocultar esta configuración. |
| Credenciales privadas de administración | Archivos JSON de cuentas de servicio, claves privadas, `FIREBASE_PRIVATE_KEY`, tokens de CI | **Nunca.** Solo en secretos del entorno de ejecución o del proveedor de CI. |

## 3. Arquitectura y convenciones

- Respeta la arquitectura descrita en `docs/ARQUITECTURA.md`. Si una tarea exige cambiarla, propón el cambio primero y espera aprobación.
- Mantén los módulos desacoplados: cada funcionalidad debe poder añadirse o retirarse sin reescribir el resto.
- **Idioma:** interfaz, documentación y nombres de dominio en **español** (`clientes`, `proyectos`, `facturas`). Los términos técnicos estándar pueden ir en inglés (`auth`, `token`, `hook`). Lista de decisiones en `docs/ARQUITECTURA.md`.
- **Stack aprobado:** Next.js (App Router, exportación estática) con React y TypeScript en el frontend; Firebase Authentication para el acceso y Firebase Hosting para el despliegue; Cloud Firestore y Cloud Functions cuando se aprueben. No cambies el stack sin aprobación.
- **Facturación** vive dentro del CRM. No implementes cobro con tarjeta propio: usa un proveedor de pagos cuando llegue esa fase.
- No añadas dependencias nuevas sin justificarlo en el mensaje de commit o en la documentación.
- Escribe código comprensible antes que código ingenioso.

## 4. Prioridades

En orden:

1. **Seguridad.**
2. **Calidad del código.**
3. **Documentación.**
4. Velocidad de entrega.

## 5. Reglas de seguridad del repositorio público

- **No publiques** contraseñas, tokens, credenciales, claves privadas ni cuentas de servicio.
- **No subas archivos `.env`** con valores reales. Usa `.env.example` con variables de ejemplo sin secretos.
- **No subas datos personales ni información privada de clientes**, ni siquiera en ejemplos, fixtures o capturas. Usa datos ficticios.
- Antes de **cada commit y cada push**:
  1. Revisa `git status` y `git diff --staged`.
  2. Confirma que ningún archivo sensible está en el área de staging.
  3. Busca patrones de secretos (por ejemplo `api_key`, `secret`, `token`, `BEGIN PRIVATE KEY`, `"type": "service_account"`).
- Si detectas un secreto ya publicado, **avisa de inmediato** al responsable. Hay que rotar la credencial; borrarla en un commit posterior no basta.
- No hagas `push` a GitHub sin confirmación explícita del responsable del proyecto.

## 6. Calidad y documentación

- Todo cambio funcional debe incluir o actualizar la documentación afectada.
- Los cambios grandes se documentan en `docs/ARQUITECTURA.md` o en un documento nuevo bajo `docs/`.
- Los mensajes de commit deben describir el *porqué* del cambio, en una línea clara en imperativo.
- Si una tarea no se puede verificar (tests, build, reglas de Firebase), dilo explícitamente en lugar de darla por buena.

## 7. Flujo de trabajo

1. Lee `AGENTS.md` y `docs/ARQUITECTURA.md`.
2. Confirma qué fase del proyecto corresponde a la tarea. Si no está definida, pregunta.
3. Haz cambios pequeños y revisables.
4. Revisa seguridad y calidad antes de confirmar el cambio.
5. Documenta lo que haya cambiado.
6. Pide confirmación antes de cualquier acción que afecte al repositorio remoto o a Firebase en producción.
