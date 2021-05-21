const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
      main:  './src/script/script.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: "./src/index.html",
          chunks: ['main']
        }),
        new CleanWebpackPlugin()
    ],
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                 ['@babel/preset-env', { useBuiltIns: 'usage', corejs: {version: 3} }]
              ]
            }
          }
        }
      ]
    }
}