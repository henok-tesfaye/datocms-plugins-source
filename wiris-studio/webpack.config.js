const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: __dirname + '/src/index.jsx',
  mode: process.env.NODE_ENV,
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  devServer: {
    contentBase: './',
    disableHostCheck: true,
    public: 'http://localhost:5000',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: __dirname + '/src',
        loader: 'eslint-loader',
        enforce: 'pre',
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: { loader: 'babel-loader' } },
      {
        test: /\.sass$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.svg/,
        use: {
          loader: 'svg-url-loader',
          options: {}
        }
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new CopyPlugin([
      { from: './public/quizzes/resources', to: 'resources' }
    ]),
    new HtmlWebpackPlugin({
      title: 'DatoCMS plugin',
      minify: isProduction,
    }),
    new HtmlWebpackTagsPlugin({
      append: false,
      publicPath: '',
      tags: [
        'https://unpkg.com/datocms-plugins-sdk@0.0.9/dist/sdk.js',
        'https://unpkg.com/datocms-plugins-sdk@0.0.9/dist/sdk.css',
        'http://code.jquery.com/jquery-1.11.3.min.js',
        './resources/quizzes.js'
      ],
      metas: [
        {
          attributes: {
            'http-equiv': 'Content-Security-Policy',
            content: 'upgrade-insecure-requests'
          }
        }
      ]
    }),
  ].filter(Boolean),
}
