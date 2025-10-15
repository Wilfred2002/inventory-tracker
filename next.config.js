/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'utfs.io'], // Add your image domains here
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
