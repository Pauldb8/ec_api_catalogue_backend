const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/app.ts',
  target: 'node',
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
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        './node_modules/swagger-ui-dist/swagger-ui.css',
        './node_modules/swagger-ui-dist/swagger-ui-bundle.js',
        './node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js',
        './node_modules/swagger-ui-dist/favicon-16x16.png',
        './node_modules/swagger-ui-dist/favicon-32x32.png',
      ],
    }),
  ],
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
