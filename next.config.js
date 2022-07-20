/* eslint-disable no-undef */
const withPwa = require('next-pwa')

module.exports = withPwa({
  reactStrictMode: true,
  swcMinify: true,
  // pwa: {
  //   disable: process.env.NODE_ENV === 'development',
  //   dest: 'public',
  //   register: true,
  //   skipWaiting: true,
  // },
  experimental: {
    // ? TODO: When this bug is fixed, un-comment concurrentFeatures & serverComponents
    // * https://github.com/vercel/next.js/issues/30586
    // concurrentFeatures: true,
    // serverComponents: true,
    // urlImports: []
  }
})
