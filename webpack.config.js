//var path = require('path');
//var webpack = require('webpack');
//
//var plugins = [new webpack.HotModuleReplacementPlugin()];
//var entry = ['./src/index'];
//
//if (process.env.NODE_ENV === "production") {
//  plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true, comments: false}));
//} else {
//  entry.push('webpack-dev-server/client?http://localhost:3000');
//  entry.push('webpack/hot/only-dev-server');
//}
//
//module.exports = {
//  devtool: 'eval',
//  entry: entry,
//  output: {
//    path: path.join(__dirname, 'dist'),
//    filename: 'bundle.js',
//    publicPath: '/static/'
//  },
//  plugins: plugins,
//  module: {
//    loaders: [
//      {
//        test: /\.js$/,
//        loaders: ['react-hot', 'babel'],
//        include: path.join(__dirname, 'src')
//      },
//      {test: /\.json$/, loader: 'json-loader'}
//    ]
//  }
//};
const path = require('path');
const webpack = require('webpack')
module.exports = {
  //devtool: 'source-maps', // use this when using the chrome devtools debugger
  devtool: 'eval',
  context: path.join(__dirname, "src"),
  entry: {
    app: ['./index.js', 'webpack-hot-middleware/client']
  },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'build'),
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  resolve: {
    extensions: ['', '.js'],
    root: path.join(__dirname, 'src')
  },
  module: {
    loaders: [
      {test: /\.json$/, loader: 'json-loader'},
      {test: /\.txt$/, loader: 'raw-loader'},
      {test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/, loader: 'url-loader?limit=10000'},
      {test: /\.(eot|ttf|wav|mp3)$/, loader: 'file-loader'},
      {
        test: /\.js$/,
        loader: 'babel',
        include: [path.join(__dirname, 'src')]
      }
    ]
  }
};
