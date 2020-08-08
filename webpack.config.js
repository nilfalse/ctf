const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');

module.exports = (env, { mode, watch }) => {
  logIfDefined(process.env.NODE_ENV, 'process.env.NODE_ENV');
  logIfDefined(env, 'env');
  logIfDefined(mode, 'mode');

  const isDevelopment =
    process.env.NODE_ENV === 'development' ||
    env === 'development' ||
    mode === 'development' ||
    watch;

  const development = {
    mode: 'development',
    devtool: 'inline-cheap-module-source-map',
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

  const common = merge(
    {
      mode: mode || 'production',

      module: {
        rules: [{ test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ }],
      },
      resolve: { extensions: ['.tsx', '.ts', '.js'] },
      output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js',
        path: path.resolve(__dirname, 'bundle'),
      },
      optimization: {
        runtimeChunk: 'single',
      },
    },

    isDevelopment ? development : {}
  );

  const cssProductionOptimization = {
    optimization: {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
  };

  return [
    merge(common, maxmindMocks, {
      entry: { background: './src/background' },
    }),

    merge(common, isDevelopment ? {} : cssProductionOptimization, {
      plugins: [new MiniCssExtractPlugin()],
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [{ loader: MiniCssExtractPlugin.loader }, 'css-loader'],
          },
        ],
      },

      entry: {
        popup: './src/popup',
      },
    }),
  ];
};

function logIfDefined(value, name) {
  if (value !== undefined) {
    console.log(`"${name}" is ${value}`);
  }
}
