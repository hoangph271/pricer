// eslint-disable-next-line no-undef
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // ? TODO: When this bug is fixed, un-comment concurrentFeatures & serverComponents
    // * https://github.com/vercel/next.js/issues/30586
    // concurrentFeatures: true,
    // serverComponents: true,
    // appDir: true,
    urlImports: [],
    forceSwcTransforms: true,
  }
}
