var webpack = require('webpack');
var path = require('path');

module.exports = {
  // context:  + '/app',
  // entry: {
  //   jsx: path.join(__dirname, 'main.jsx'),
  //   html: path.join(__dirname, 'index.html'),
  //   vendor: ['react']
  // },
  // entry: path.join(__dirname, './main.js'),
  entry: './main.jsx',
  output: {
    path: __dirname,
    // path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  // resolve: {
  //   extensions: ['', '.js', '.jsx']
  // },
};
