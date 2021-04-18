const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');

const { BasicEntrypoint } = require('./_basic');

class ReactEntrypoint extends BasicEntrypoint {
  get configuration() {
    return {
      resolve: {
        alias: {
          'react-dom': '@hot-loader/react-dom',
        },
      },
      module: {
        rules: [
          this.typescriptRule,
          {
            test: /\.css$/,
            use: [
              this.bundle.isDevelopment
                ? 'style-loader'
                : MiniCssExtractPlugin.loader,
              'css-loader',
            ],
          },
          {
            test: /\.(woff|svg)$/,
            type: 'asset/resource',
            generator: {
              filename: this.bundle.isDevelopment
                ? '[name].[contenthash:8][ext]'
                : '[name][ext]',
            },
          },
        ],
      },
    };
  }

  get plugins() {
    return [...super.plugins, new MiniCssExtractPlugin()];
  }

  get typescriptRule() {
    return merge(super.typescriptRule, {
      use: {
        options: {
          plugins: ['react-hot-loader/babel'],
        },
      },
    });
  }
}

module.exports.ReactEntrypoint = ReactEntrypoint;
