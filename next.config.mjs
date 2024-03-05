/** @type {import('next').NextConfig} */
const nextConfig = {
   typescript: {
      ignoreBuildErrors: true,
   },
   experimental: {
      serverActions: {
         allowedOrigins: [ 'k99cvp9k-3000.euw.devtunnels.ms' ],
      }
   }
};

export default nextConfig;

