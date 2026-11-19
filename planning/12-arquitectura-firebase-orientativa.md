# 12 · Arquitectura de datos orientativa en Firebase

> **Importante:** este documento es una **orientación**, no un diseño cerrado. La decisión final se toma en `docs/ARQUITECTURA.md` cuando se aprueben las funcionalidades.

## Servicios previstos

| Servicio | Uso |
|---|---|
| Firebase Authentication | Inicio de sesión de usuarios de la agencia y de clientes |
| Cloud Firestore | Datos de negocio: clientes, oportunidades, proyectos, tiempo, uso de IA |
| Cloud Storage | Documentos, propuestas firmadas y entregables |
| Security Rules | Control de acceso a Firestore y Storage |
| Cloud Functions (opcional) | Lógica de servidor: automatizaciones, cálculos, integraciones |

## Modelo multi-agencia y multi-cliente

Hay dos niveles de aislamiento a considerar:

- **Organización (tenant):** si el CRM sirve a varias agencias, cada una necesita aislamiento total. Si es para una sola agencia, este nivel se simplifica.
- **Cliente de la agencia:** aislamiento dentro de la agencia para que cada cuenta de cliente vea solo lo suyo en el portal.

Opciones de estructura en Firestore: [Fuente 23, 26]

- **Subcolecciones por cliente**, p. ej. `clientes/{id}/proyectos/{id}`. Facilitan reglas por ruta y el borrado por jerarquía, pero dificultan los informes entre clientes, que requieren consultas de grupo de colección.
- **Colecciones raíz con identificador de cliente en cada documento**, p. ej. `proyectos` con `clienteId`. Facilitan informes globales y consultas transversales, pero exigen reglas que comprueben el campo en cada operación.

Una fuente recomienda guardar el identificador de organización en un campo de cada documento, aunque se use subcolección, para poder hacer consultas de administración. [Fuente 23]

## Consideraciones de diseño

- **Lecturas facturadas:** Firestore cobra por documento leído, y las reglas que leen otros documentos también generan lecturas facturables. Hay que diseñar para evitar lecturas repetidas. [Fuente 24]
- **Consultas de reportes:** los dashboards agregados no deben recorrer todos los documentos en cada carga. Conviene un documento de resumen actualizado por una función o por un proceso programado.
- **Límites:** tamaño máximo de documento, número de escrituras por segundo y límites de reglas. Verificar siempre en la documentación oficial de límites de Firestore antes de diseñar; las fuentes consultadas no los incluyen.
- **Eliminación en cascada:** las subcolecciones no se borran automáticamente con el documento padre. Hay que diseñar esa operación explícitamente. [Fuente 26]
- **Índices:** cada consulta compuesta necesita su índice; planificarlos con las consultas de los dashboards.

## Separación de datos sensibles

- Tarifas, márgenes y costes de IA en documentos o colecciones con reglas más estrictas que los datos comerciales generales.
- Datos del portal de cliente sin campos internos: mejor una colección separada de "vista de cliente" que filtrar campos en la aplicación.
- Secretos de integraciones fuera de Firestore, en el gestor de secretos del entorno de servidor.

## Entornos

Separar al menos dos proyectos de Firebase: uno de desarrollo y otro de producción, con sus propias reglas y datos. Nunca usar datos reales en desarrollo.
