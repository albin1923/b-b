/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    middlewareClientMaxBodySize: '25mb',
  },
}

export default nextConfig
