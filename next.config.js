/* eslint-disable no-undef */
const withPwa = require('next-pwa')

module.exports = withPwa({
  reactStrictMode: true,
  swcMinify: true,
  pwa: {
    disable: process.env.NODE_ENV === 'development',
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
