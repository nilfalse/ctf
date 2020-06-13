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
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: 'background.js',
      path: path.resolve(__dirname, 'output'),
    },
  },
];
