/* eslint-disable @typescript-eslint/no-var-requires */
const nextBuildId = require('next-build-id');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  generateBuildId: () => nextBuildId(),
  webpack: (config, { buildId, webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.BUILD_ID': JSON.stringify(buildId),
      })
    );

    const prefix = nextConfig.assetPrefix || '';
    const basePath = nextConfig.basePath || '';

    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: `${prefix || basePath}/_next/static/`,
            outputPath: `${config.isServer ? '../' : ''}static/`,
            name: '[name]-[hash].[ext]',
          },
        },
      ],
    });

    return config;
  },
};

module.exports = nextConfig;
