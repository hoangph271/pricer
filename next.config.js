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
    urlImports: [
      'https://fonts.googleapis.com/css?family=Press+Start+2P',
      'https://unpkg.com/nes.css@2.3.0/css/nes.min.css'
    ]
  }
})
