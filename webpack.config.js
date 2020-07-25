const path = require('path');

module.exports = [
  {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './src/background.ts',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },

        {
          test: path.resolve(__dirname, './node_modules/maxmind/lib/fs.js'),
          use: 'null-loader',
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: 'background.js',
      path: path.resolve(__dirname, 'output'),
    },

    node: {
      net: 'empty',
    },
  },
];
