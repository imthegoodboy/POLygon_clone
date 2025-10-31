module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["ipfs.infura.io"],
  },
  eslint: {
    // Avoid failing the build on ESLint errors during Render deploys
    ignoreDuringBuilds: true,
  },
};
