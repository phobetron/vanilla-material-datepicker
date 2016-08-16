module.exports = function (config) {
  config.set({
    singleRun: true,
    sauceLabs: { testName: 'Web App Unit Tests' },
    browsers: [ 'PhantomJS' ],
    frameworks: [ 'mocha', 'sinon-chai' ],
    reporters: [ 'progress' ],
    files: [ 'src/**/*Spec.js' ],
    preprocessors: {
      'src/**/*Spec.js': [ 'webpack', 'sourcemap' ]
    },
    client: {
      chai: { includeStack: true }
    },
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          { test: /\.js$/, loader: 'babel-loader' }
        ]
      }
    },
    webpackServer: { noInfo: true },
    phantomjsLauncher: { exitOnResourceError: true }
  });
};
