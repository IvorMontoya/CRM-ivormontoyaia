import type { NextConfig } from "next";

// Exportación estática: genera la carpeta `out/` que se despliega en Firebase Hosting.
// No hay funciones de servidor; toda la lógica de autenticación corre en el navegador.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // Tailwind CSS v4 con Turbopack (regla de la plantilla de create-next-app).
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
