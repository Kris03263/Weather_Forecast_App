const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './app/(tabs)/index.tsx',
  output: {
    filename: '[name].[contenthash].js', // Use dynamic filenames with content hash
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Clean the output directory before emit
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules\/(?!react-native-modal-dropdown)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-expo'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};