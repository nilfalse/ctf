const path = require('path');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');

module.exports = (env, { mode, watch }) => {
  const bundlePath = path.resolve(__dirname, 'bundle');

  const isDevelopment = watch;

  process.env.NODE_ENV = isDevelopment ? 'development' : 'production';

  const development = {
    mode: 'development',
    devtool: 'inline-cheap-module-source-map',
    devServer: {
      contentBase: bundlePath,
      port: 35727,
      writeToDisk: true, // https://github.com/webpack/webpack-dev-server/issues/62#issuecomment-488549135
      disableHostCheck: true, // https://github.com/webpack/webpack-dev-server/issues/1604#issuecomment-449845801
    },
  };

  const maxmindMocks = {
    module: {
      rules: [
        {
          test: path.resolve(__dirname, './node_modules/maxmind/lib/fs.js'),
          use: 'null-loader',
        },
      ],
    },
    node: { net: 'empty' },
  };

  const typescriptRule = {
    test: /\.(tsx?)|(jsx?)$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: { cacheDirectory: true },
    },
  };

  const common = merge(
    {
      mode: mode || 'production',

      plugins: [new ForkTsCheckerWebpackPlugin()],
      resolve: { extensions: ['.tsx', '.ts', '.js'] },
      output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js',
        path: bundlePath,
      },
      optimization: { runtimeChunk: 'single' },
    },

    isDevelopment ? development : {}
  );

  const cssProductionOptimization = {
    optimization: {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
  };

  const configs = [
    merge(common, maxmindMocks, {
      entry: { background: './src/background' },

      module: {
        rules: [typescriptRule],
      },
    }),

    merge(common, isDevelopment ? {} : cssProductionOptimization, {
      entry: { popup: ['react-hot-loader/patch', './src/popup'] },

      resolve: {
        alias: {
          'react-dom': '@hot-loader/react-dom',
        },
      },
      plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
          title: 'Capture The Flag Popup',
          filename: 'popup.html',
          template: 'src/popup/template.html',
        }),
      ],
      module: {
        rules: [
          merge(typescriptRule, {
            use: {
              options: {
                presets: ['@babel/preset-react'],
                plugins: ['react-hot-loader/babel'],
              },
            },
          }),
          {
            test: /\.css$/,
            use: [
              isDevelopment
                ? 'style-loader'
                : { loader: MiniCssExtractPlugin.loader },
              'css-loader',
            ],
          },
        ],
      },
    }),
  ];

  return configs;
};
