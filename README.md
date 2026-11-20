# CRM para agencias de IA

CRM personalizado para agencias de inteligencia artificial: gestión de clientes, oportunidades, proyectos y actividad comercial, diseñado para crecer por módulos.

> **Estado:** primera versión funcional: landing, inicio de sesión con usuario y contraseña, panel con menú lateral y pestaña **Clientes** (clientes → proyectos → comentarios). Los datos se guardan en el navegador; la base de datos llegará en una fase posterior.

> **Aviso sobre `planning/`:** la carpeta [planning/](planning/README.md) es el resultado de una investigación en fuentes externas. **No es la planificación real del proyecto**: sirve solo como referencia. Las funcionalidades, prioridades y orden de implementación se deciden siempre con el responsable del proyecto, y los agentes deben preguntarle antes de tomar cualquier decisión basándose en esa carpeta.

## Objetivos

- Arquitectura escalable y modular, que permita añadir funcionalidades de forma progresiva.
- Seguridad desde el diseño, especialmente porque el repositorio es público.
- Infraestructura basada en **Firebase** (autenticación, base de datos y otros servicios).

## Documentación

- [AGENTS.md](AGENTS.md): instrucciones para agentes de IA que trabajen en el proyecto.
- [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md): decisiones de arquitectura y módulos (pendiente de definir).

## Stack

- **Next.js** (App Router) con **React** y **TypeScript**, en modo de exportación estática (`output: "export"`).
- **Tailwind CSS** y componentes de **shadcn/ui**, escritos en `src/components/ui/`.
- **Firebase**: Authentication (usuario y contraseña) y Hosting. Los datos de la aplicación se guardan por ahora en `localStorage`.

## Estructura

```
src/
├── app/
│   ├── page.tsx              Landing pública
│   ├── login/                Inicio de sesión
│   └── panel/                Área privada (requiere sesión)
│       ├── layout.tsx        Menú lateral y protección de la ruta
│       ├── page.tsx          Inicio (resumen)
│       └── clientes/         Clientes → proyectos → comentarios
├── components/               Componentes propios y de shadcn/ui
└── lib/
    ├── firebase.ts           Inicialización del SDK de Firebase
    ├── navegacion.ts         Pestañas del menú lateral (añadir pestañas aquí)
    └── crm/                  Tipos, operaciones y almacenamiento local
```

Para añadir una pestaña nueva: crea su página bajo `src/app/panel/` y añádela a `PESTANAS` en `src/lib/navegacion.ts`.

## Configuración local

1. Instala dependencias: `npm install`.
2. Copia `.env.example` a `.env.local` y rellena los valores de la app web de Firebase (consola de Firebase → Configuración del proyecto → Tus apps).
3. En la consola de Firebase, activa **Authentication → Método de acceso → Correo electrónico/contraseña** y crea los usuarios desde **Authentication → Usuarios**. No hay registro público.
4. Arranca en desarrollo: `npm run dev` y abre http://localhost:3000.

Nunca subas `.env*` reales al repositorio: están excluidos en `.gitignore`.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Genera la versión estática en `out/` |
| `npm run lint` | Revisión de código con ESLint |
| `npx tsc --noEmit` | Comprobación de tipos |

## Despliegue en Firebase Hosting

```bash
npm run build
npx firebase-tools login      # una vez por equipo
npx firebase-tools deploy --only hosting
```

El proyecto de Firebase es `crm-ivormontoyaia` (ver `.firebaserc`). La carpeta publicada es `out/`.

## Seguridad

Este repositorio es público. No publiques contraseñas, tokens, claves privadas, credenciales de cuentas de servicio ni datos de clientes. Para reportar una vulnerabilidad, contacta con el responsable del proyecto en lugar de abrir un issue público.

## Licencia

Este proyecto se distribuye bajo la [GNU Affero General Public License v3.0](LICENSE) (AGPL-3.0). Si ejecutas una versión modificada de este software como servicio para terceros, debes poner a disposición de sus usuarios el código fuente de esa versión.
