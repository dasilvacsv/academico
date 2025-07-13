/** @type {import('next').NextConfig} */
const nextConfig = {
  
   output: 'standalone',

  // Opciones del usuario para ignorar errores y optimizar imágenes para exportación
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
