const path = require('path');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const { merge } = require('webpack-merge');

const pkg = require('./package.json');

module.exports = function (_, { hot }) {
  const bundlePath = path.resolve(__dirname, 'bundle');
  const popupHtmlPath = 'popup.html';

  const isDevelopment = hot;

  process.env.NODE_ENV = isDevelopment ? 'development' : 'production';

  const devServer = {
    contentBase: bundlePath,
    port: 35727,
    writeToDisk: true, // https://github.com/webpack/webpack-dev-server/issues/62#issuecomment-488549135
    disableHostCheck: true, // https://github.com/webpack/webpack-dev-server/issues/1604#issuecomment-449845801
  };

  const development = {
    mode: 'development',
    devtool: 'inline-cheap-module-source-map',
  };

  const production = {
    mode: 'production',
    optimization: {
      minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin()],
    },
  };

  // https://ilin.dk/weblog/maxmind-in-browser
  const maxmindMocks = {
    resolve: {
      alias: {
        net: path.resolve(
          __dirname,
          './node_modules/node-libs-browser/mock/net.js'
        ),
      },
    },
    module: {
      rules: [
        {
          test: path.resolve(__dirname, './node_modules/maxmind/lib/fs.js'),
          use: 'null-loader',
        },
      ],
    },
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
      stats: { children: false },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
        new ForkTsCheckerWebpackPlugin(),
      ],
      resolve: { extensions: ['.tsx', '.ts', '.js'] },
      output: {
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
        path: bundlePath,
        hotUpdateChunkFilename: 'hot/[id].[hash].hot-update.js',
        hotUpdateMainFilename: 'hot/[hash].hot-update.json',
      },
      optimization: {
        runtimeChunk: { name: (entrypoint) => `${entrypoint.name}.runtime` },
      },
    },

    isDevelopment ? development : production
  );
  if (!process.env.CI) {
    common.plugins.push(new webpack.ProgressPlugin());
  }

  console.log(common.mode);
  return [
    merge(common, maxmindMocks, {
      entry: { background: './src/background' },

      devServer,
      module: {
        rules: [typescriptRule],
      },
      plugins: [
        new ManifestPlugin({
          seed: {
            popupHtmlPath,
            devServer: isDevelopment ? devServer : null,
          },
          generate: manifestFactory,
        }),
      ],
    }),

    merge(common, {
      entry: { popup: ['react-hot-loader/patch', './src/popup'] },

      resolve: {
        alias: {
          'react-dom': '@hot-loader/react-dom',
        },
      },
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
              isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
              'css-loader',
            ],
          },
          {
            test: /\.(woff|svg)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: isDevelopment
                    ? '[name].[contenthash:8].[ext]'
                    : '[name].[ext]',
                },
              },
            ],
          },
        ],
      },
      plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
          title: 'Popup',
          filename: popupHtmlPath,
          template: 'src/popup/template.html',
        }),
      ],
    }),
  ];
};

function manifestFactory({ popupHtmlPath, devServer }, _, entrypoints) {
  const icons = {
    32: 'icons/icon_32px.png',
    48: 'icons/icon_48px.png',
    128: 'icons/icon_128px.png',
    256: 'icons/icon_256px.png',
    512: 'icons/icon_512px.png',
  };

  const { author, version } = pkg;
  const manifest = {
    manifest_version: 2,

    name: '__MSG_ext_name__',
    version,

    default_locale: 'en',
    description: '__MSG_ext_description__',
    icons,

    page_action: {
      default_icon: icons,
      default_popup: popupHtmlPath,
      show_matches: ['<all_urls>'],
    },

    author,
    background: {
      scripts: entrypoints.background,
    },

    minimum_chrome_version: '36',

    permissions: ['webRequest', '<all_urls>'],

    short_name: '__MSG_ext_short_name__',
    version_name: getVersionTag(),
  };

  if (devServer) {
    manifest.content_security_policy = [
      `script-src 'self' 'unsafe-eval' http://localhost:${devServer.port}`,
      "object-src 'self'",
    ].join('; ');
  }

  return manifest;
}

function getVersionTag() {
  const { TRAVIS_TAG, TRAVIS_COMMIT } = process.env;
  const version = TRAVIS_TAG || pkg.version;

  return TRAVIS_COMMIT && `${version} (${TRAVIS_COMMIT.substring(0, 8)})`;
}
