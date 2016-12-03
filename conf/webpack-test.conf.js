export default {
  devtool: 'source-map',
  debug: true,
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
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015'],
          sourceMaps: 'inline',
          plugins: [
            'transform-object-assign',
            //'rewire',
            ['istanbul', { exclude: ['**/*.test.js*'] }]
          ]
        }
      },
      { test: /\.(css|scss)$/, loader: 'style-loader!css-loader!postcss-loader!sass-loader' }
    ]
  },
  plugins: []
};
