/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fakeimg.pl',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',  // This will allow all domains - adjust based on your needs
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;

