const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: [
    './src/front/js/index.js'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/'
  },
  module: {
    rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
          test: /\.(css|scss)$/, 
          use: [
            { loader: "style-loader" }, 
            { loader: "css-loader" }
          ]
        },
        {
          test: /\.(png|svg|jpg|gif|jpeg|webp)$/, 
          use: {
            loader: 'file-loader',
            options: { name: '[name].[ext]' }
          }
        },
        { 
          test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/, 
          use: ['file-loader'] 
        }
    ]
  },
  resolve: {
    extensions: ['*', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: 'template.html',
        filename: 'index.html',
        favicon: 'favicon.jpg'
    }),
    // systemvars:true reads env vars from the system (Heroku Config Vars) at
    // build time. `safe:true` removed — it required every var in .env.example
    // (incl. backend-only keys) and treated empty values as missing, which
    // broke the frontend build that only needs BACKEND_URL/BASENAME.
    new Dotenv({ systemvars: true })
  ]
};