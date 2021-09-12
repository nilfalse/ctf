const path = require('path');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

class BasicEntrypoint {
  constructor(bundle) {
    this.bundle = bundle;
  }

  get configuration() {
    throw new Error('Not implemented');
  }

  build() {
    return merge(
      {
        stats: { children: false },
        context: this.bundle.rootPath,
        plugins: this.plugins,
        resolve: { extensions: ['.tsx', '.ts', '.js'] },
        output: {
          chunkFilename: '[name].chunk.js',
          path: this.bundle.path,
          hotUpdateChunkFilename: 'hot/chunk~[id]~[fullhash].js',
          hotUpdateMainFilename: 'hot/main_[runtime]_[fullhash].json',
        },
        optimization: {
          runtimeChunk: {
            name: (entrypoint) => `${entrypoint.name}.runtime`,
          },
        },
      },
      this.configuration,
      this.bundle.extra
    );
  }

  get plugins() {
    const plugins = [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: path.resolve(this.bundle.rootPath, 'tsconfig.build.json'),
        },
      }),
    ];

    return plugins;
  }

  get typescriptRule() {
    return {
      test: /\.(tsx?)|(jsx?)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          configFile: path.resolve(this.bundle.rootPath, 'babel.config.cjs'),
        },
      },
    };
  }
}

module.exports.BasicEntrypoint = BasicEntrypoint;
