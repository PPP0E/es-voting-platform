/** @type {import('next').NextConfig} */
const nextConfig = {
   typescript: {
      ignoreBuildErrors: true,
   },
   experimental: {
      serverComponentsExternalPackages: [ "undici" ]
   }
};

export default nextConfig;


