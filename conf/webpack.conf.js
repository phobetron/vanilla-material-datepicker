import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/dev-server',
    './src/datepicker'
  ],
  output: {
    path: path.join(process.cwd(), '.tmp'),
    filename: 'datepicker.js',
    library: 'Datepicker',
    libraryTarget: 'var'
  },
  debug: true,
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(css|scss)$/,
        loaders: [
          'style',
          'css',
          'sass',
          'postcss'
        ]
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
          name: '[name]_[hash]',
          prefixize: true
        })}`
      },
      { test: /\.(pug|jade)$/, loader: 'pug' }
    ]
  },
  postcss: () => [autoprefixer],
  plugins: [
    new HtmlWebpackPlugin({ template: 'index.pug' }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  ]
};
