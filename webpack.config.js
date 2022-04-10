const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const src = path.resolve(__dirname, 'src');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  module:{
    rules: [
    {
      test: /\.(glb|gltf)$/i, 
      loader: 'file-loader'
    }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(src, 'index.html')
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};