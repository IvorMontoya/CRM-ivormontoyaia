# Instrucciones para agentes de IA

Este archivo es de lectura obligatoria para cualquier agente de IA que participe en el desarrollo de este proyecto. Revísalo antes de realizar cambios importantes.

## 1. Contexto del proyecto

- Es un CRM personalizado para agencias de inteligencia artificial.
- El repositorio es **público**. Todo lo que se publique puede ser visto, copiado e indexado.
- El desarrollo se hace **por fases**. La fase actual es la 0: estructura, Git/GitHub, documentación e instrucciones.
- **No implementes funcionalidades del CRM** hasta que la arquitectura y los módulos estén definidos y aprobados por el responsable del proyecto.

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
- **Stack aprobado:** React + TypeScript + Vite en el frontend; Firebase Authentication y Cloud Firestore para datos y acceso; Cloud Functions para lógica de servidor. No cambies el stack sin aprobación.
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
