import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default {
  externals: { moment: 'moment' },
  entry: [
    './src/datepicker.scss',
    './src/datepicker'
  ],
  output: {
    path: './dist',
    filename: 'datepicker.js',
    library: 'Datepicker',
    libraryTarget: 'var'
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(css|scss)$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader')
      },
      {
        test: /\.(gif|png|jpe?g)$/,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?{progressive: true, optimizationLevel: 7, interlaced: false, pngquant: { quality: "65-90", speed: 4 } }'
        ]
      },
      {
        test: /\.svg$/,
        loader: `svg-sprite?${JSON.stringify({
          name: '[name]-[hash]',
          prefixize: true
        })}`
      }
    ]
  },
  postcss: () => [autoprefixer],
  plugins: [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
    new ExtractTextPlugin('datepicker.css', { allChunks: false }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: false,
      compressor: { screw_ie8: true, warnings: false },
      output: { comments: false }
    })
  ]
};
