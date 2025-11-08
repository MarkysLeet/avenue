/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avenueprofessional.net',
        pathname: '/assets/images/**'
      },
      {
        protocol: 'https',
        hostname: 'www.avenueprofessional.net',
        pathname: '/assets/images/**'
      }
    ]
  }
};

module.exports = nextConfig;
