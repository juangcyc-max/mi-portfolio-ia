import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.mindbride.net" }],
        destination: "https://mindbride.net/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    // ✅ Agregar calidad 100 para office-background.jpg
    qualities: [75, 100],
    // ✅ Permitir dominios si usas imágenes externas
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // ✅ Optimizar compilación
  reactStrictMode: true,
  // ✅ TypeScript config
  typescript: {
    // Permitir builds con errores de TS (opcional)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;