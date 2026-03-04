/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // ✅ requerido por Render

  // 👇 evita bloqueos en el build de Render
  staticPageGenerationTimeout: 60,
  experimental: {
    typedRoutes: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },
      // 👇 si usas imágenes en Render, agrega esto:
      {
        protocol: "https",
        hostname: "**.onrender.com",
      },
    ],
  },
};

module.exports = nextConfig;
