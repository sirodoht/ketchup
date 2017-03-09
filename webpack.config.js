module.exports = {
  entry: ['bootstrap-loader', './app/app.js'],
  output: {
    path: './build',
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  performance: {
    hints: 'warning',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          emitErrors: true,
          failOnError: true,
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader',
      },
    ],
  },
};
