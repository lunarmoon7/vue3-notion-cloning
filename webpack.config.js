const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  resolve: {
    extensions: ['.vue', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/', // createWebHistory() 사용 시 필요
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.s?css$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              // 모든 scss 파일에서 _variables.scss를 import 하지 않아도 사용 가능
              additionalData: `
                @use "sass:color";
                @use 'sass:list';
                @use 'sass:map';
                @use 'sass:math';
                @use 'sass:meta';
                @use 'sass:selector';
                @use 'sass:string';
                @import "@/scss/_variables"; 
                `,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlPlugin({ template: './src/index.html' }),
    new CopyPlugin({
      patterns: [{ from: 'static' }],
    }),
  ],
  devServer: {
    port: 7777,
    historyApiFallback: true, // createWebHistory() 사용 시 필요, URL에 해당하는 페이지가 없을 경우 index.html로 리다이렉트 시켜줌
  },
};
