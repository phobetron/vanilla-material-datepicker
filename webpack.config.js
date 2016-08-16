var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    './src/datepicker.scss',
    './src/datepicker'
  ],

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'datepicker.js',
    library: 'Datepicker',
    libraryTarget: 'var'
  },

  externals: {
    moment: 'moment'
  },

  cache: true,
  debug: true,

  // For options, see http://webpack.github.io/docs/configuration.html#devtool
  devtool: 'cheap-module-source-map',

  module: {
    loaders: [
      // JS
      {
        test: /.js/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      },

      // Load styles
      { test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader')
      }
    ]
  },

  postcss: function() {
    return [autoprefixer];
  },

  plugins: [
      new ExtractTextPlugin('datepicker.css', {allChunks: false}),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {screw_ie8: true, keep_fnames: true, warnings: false},
        mangle: {screw_ie8: true, keep_fnames: true}
      }),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.AggressiveMergingPlugin()
    ],

  resolveLoader: {
    root: path.join(__dirname, 'node_modules'),
  },

  resolve: {
    root: path.join(__dirname, 'node_modules'),

    modulesDirectories: ['node_modules'],

    // Allow to omit extensions when requiring these files
    extensions: ['', '.js'],
  }
}
