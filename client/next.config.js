module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [new URL('https://images.unsplash.com/**'), new URL('https://plus.unsplash.com/**'), new URL('https://res.cloudinary.com/**')],
  },
}