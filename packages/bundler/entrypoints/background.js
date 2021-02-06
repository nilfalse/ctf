const path = require('path');

const ManifestPlugin = require('webpack-manifest-plugin');
const { merge } = require('webpack-merge');

const { BasicEntrypoint } = require('./_basic');

class BackgroundEntrypoint extends BasicEntrypoint {
  get configuration() {
    return merge(this._maxmindMocks, this._devServer, {
      entry: {
        background: `${this.bundle.runtimePath}/entrypoints/background`,
      },

      module: {
        rules: [this.typescriptRule],
      },
    });
  }

  get plugins() {
    return [
      ...super.plugins,

      new ManifestPlugin({
        seed: this.bundle,
        generate: (...args) => this.getManifestFactory().create(...args),
      }),
    ];
  }

  getManifestFactory() {
    throw new Error('Not implemented');
  }

  get _maxmindMocks() {
    // https://ilin.dk/weblog/maxmind-in-browser
    return {
      resolve: {
        alias: {
          net: path.resolve(
            this.bundle.rootPath,
            'node_modules',
            'node-libs-browser',
            'mock',
            'net.js'
          ),
        },
      },
      module: {
        rules: [
          {
            test: path.resolve(
              this.bundle.rootPath,
              'node_modules',
              'maxmind',
              'lib',
              'fs.js'
            ),
            use: 'null-loader',
          },
        ],
      },
    };
  }

  get _devServer() {
    return this.bundle.devServer
      ? {
          devServer: this.bundle.devServer,
        }
      : {};
  }
}

module.exports.BackgroundEntrypoint = BackgroundEntrypoint;
