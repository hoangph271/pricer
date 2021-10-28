const withPwa = require('next-pwa')

module.exports = withPwa({
  reactStrictMode: true,
  swcMinify: true,
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
  experimental: {
    concurrentFeatures: true,
    serverComponents: true,
    // urlImports: []
  }
})
