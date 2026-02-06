const Package = require('./package');
const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const src = (p) => resolve(__dirname, 'src', p);

module.exports = (env) => ({
  mode: env.production ? 'production' : 'development',

  entry: {
    main: [src('index.ts'), src('style.css')]
  },

  output: {
    path: resolve(__dirname, 'public'),
    publicPath: env.production ? `https://cdn.lycuid.dev/p/${Package.name}/` : '/',
    filename: env.production ? '[name].[contenthash].js' : '[name].js',
    clean: true, // clean old assets in output dir
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader' // Replacing deprecated awesome-typescript-loader
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: env.production ? 'style.[contenthash].css' : 'style.css'
    }),
    new CssMinimizerPlugin(),
    new HtmlWebpackPlugin({
      template: src('index.html'),
      inject: 'body'
    })
  ],

  resolve: {
    extensions: ['.ts', '.js']
  },

  optimization: {
    minimize: env.production,
    minimizer: ['...', new CssMinimizerPlugin()]
  },
});
