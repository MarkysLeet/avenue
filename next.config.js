/** @type {import('next').NextConfig} */
const isGH = process.env.GITHUB_ACTIONS === 'true';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'avenueprofessional.net', pathname: '/assets/images/**' },
      { protocol: 'https', hostname: 'www.avenueprofessional.net', pathname: '/assets/images/**' }
    ]
  },
  assetPrefix: isGH ? `/${process.env.GITHUB_REPOSITORY?.split('/').pop()}` : undefined,
  basePath: isGH ? `/${process.env.GITHUB_REPOSITORY?.split('/').pop()}` : undefined,
  trailingSlash: true
};

module.exports = nextConfig;
