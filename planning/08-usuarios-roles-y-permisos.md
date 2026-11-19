# 08 · Usuarios, roles y permisos

## Propósito

Definir quién puede ver y cambiar qué. Es la capa de seguridad central, y en Firebase se implementa en las reglas de seguridad, no solo en la interfaz.

## Tipos de usuario

| Tipo | Alcance |
|---|---|
| Administrador de agencia | Todo el sistema, configuración y gestión de usuarios |
| Responsable de cuenta (comercial) | Sus clientes y oportunidades |
| Gestor de proyecto | Proyectos asignados, tiempo del equipo, aprobaciones |
| Miembro del equipo (técnico) | Tareas y proyectos asignados; sin datos comerciales ni de tarifas |
| Finanzas | Facturación, tarifas y costes; sin edición de proyectos |
| Cliente | Solo su espacio, en el portal |

## Funcionalidades

| Funcionalidad | Descripción | Prioridad |
|---|---|---|
| Inicio de sesión | Autenticación con Firebase Authentication (correo y contraseña, y proveedores externos si se decide) | P0 |
| Verificación de correo y recuperación | Flujo estándar de Firebase | P0 |
| Roles fijos | Conjunto cerrado de roles (tabla anterior) | P0 |
| Asignación de roles por cuenta | Rol a nivel de organización y de cliente, no solo global | P0 |
| Autenticación multifactor | Obligatoria para administradores y finanzas | P1 |
| Invitaciones | Alta de usuarios por invitación con rol asignado | P1 |
| Revocación | Desactivar un usuario corta el acceso de inmediato | P0 |
| Permisos por campo | Ocultar tarifas o márgenes a ciertos roles | P1 |
| Permisos por cliente | Un usuario solo ve los clientes que tiene asignados | P0 |
| Registro de accesos | Auditoría de inicios de sesión y cambios de permisos | P1 |

## Modelo de permisos en Firebase

Según la documentación oficial, el control de acceso por roles puede implementarse guardando los roles en Firestore y comprobándolos en las reglas con `request.auth.uid`. [Fuente 22]

Algunas fuentes recomiendan usar **custom claims** del token para comprobaciones frecuentes y guardar permisos detallados en Firestore. Una fuente indica un límite de 1000 bytes por usuario en las claims; hay que verificarlo en la documentación actual. [Fuente 23, 24]

Reglas básicas:
- Denegar todo por defecto.
- Un cliente nunca puede escribir sus propios campos de rol o de organización.
- Comprobar la pertenencia a la organización en cada lectura y escritura.
- Los accesos de administración global deben ser una excepción explícita, no un comodín.
- Las reglas se prueban con tests automatizados antes de desplegarse. [Fuente 24]

## Advertencia importante

Los SDK de servidor (Admin SDK) **se saltan las reglas de seguridad**. Cualquier código de backend debe controlar permisos por sí mismo y limitar la cuenta de servicio con IAM. [Fuente 22]
