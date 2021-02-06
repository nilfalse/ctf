const path = require('path');

class Bundle {
  constructor(env) {
    this.env = env;
    this.entrypoints = [];

    this.rootPath = path.resolve(__dirname, '..', '..');
    this.runtimePath = path.resolve(this.rootPath, 'packages', 'runtime');
    this.pkg = require(path.resolve(this.rootPath, 'package.json'));
  }

  get path() {
    throw new Error('Not implemented');
  }

  get popup() {
    return { basename: 'popup', title: 'Popup', filepath: 'popup.html' };
  }

  get options() {
    return { basename: 'options', title: 'Options', filepath: 'options.html' };
  }

  get isDevelopment() {
    return this.env.WEBPACK_SERVE;
  }

  get devServer() {
    if (this.isDevelopment) {
      return {
        contentBase: this.path,
        port: 35727,
        hot: this.isDevelopment,
        writeToDisk: true, // https://github.com/webpack/webpack-dev-server/issues/62#issuecomment-488549135
        disableHostCheck: true, // https://github.com/webpack/webpack-dev-server/issues/1604#issuecomment-449845801
      };
    } else {
      return null;
    }
  }

  get extra() {
    return this.isDevelopment ? this.development : this.production;
  }

  get development() {
    return {
      mode: 'development',
      devtool: 'inline-cheap-module-source-map',
    };
  }

  get production() {
    const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
    const TerserJSPlugin = require('terser-webpack-plugin');

    return {
      mode: 'production',
      optimization: {
        minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin()],
      },
    };
  }

  addEntrypoint(entrypoint) {
    this.entrypoints.push(entrypoint);
  }

  run() {
    process.env.NODE_ENV = this.isDevelopment ? 'development' : 'production';

    return this.entrypoints.map((entrypoint) => entrypoint.build());
  }
}

module.exports.Bundle = Bundle;
