# CRM para agencias de IA

CRM personalizado para agencias de inteligencia artificial: gestión de clientes, oportunidades, proyectos y actividad comercial, diseñado para crecer por módulos.

> **Estado:** fase 0 — estructura inicial, documentación y configuración de agentes. Aún no hay funcionalidades implementadas.

> **Aviso sobre `planning/`:** la carpeta [planning/](planning/README.md) es el resultado de una investigación en fuentes externas. **No es la planificación real del proyecto**: sirve solo como referencia. Las funcionalidades, prioridades y orden de implementación se deciden siempre con el responsable del proyecto, y los agentes deben preguntarle antes de tomar cualquier decisión basándose en esa carpeta.

## Objetivos

- Arquitectura escalable y modular, que permita añadir funcionalidades de forma progresiva.
- Seguridad desde el diseño, especialmente porque el repositorio es público.
- Infraestructura basada en **Firebase** (autenticación, base de datos y otros servicios).

## Documentación

- [AGENTS.md](AGENTS.md): instrucciones para agentes de IA que trabajen en el proyecto.
- [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md): decisiones de arquitectura y módulos (pendiente de definir).

## Configuración local

1. Copia `.env.example` a `.env.local` (o al archivo que use el entorno) y rellena los valores.
2. Nunca subas `.env*` reales al repositorio: están excluidos en `.gitignore`.

## Seguridad

Este repositorio es público. No publiques contraseñas, tokens, claves privadas, credenciales de cuentas de servicio ni datos de clientes. Para reportar una vulnerabilidad, contacta con el responsable del proyecto en lugar de abrir un issue público.

## Licencia

Este proyecto se distribuye bajo la [GNU Affero General Public License v3.0](LICENSE) (AGPL-3.0). Si ejecutas una versión modificada de este software como servicio para terceros, debes poner a disposición de sus usuarios el código fuente de esa versión.
