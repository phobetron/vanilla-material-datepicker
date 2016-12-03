import webpackConfig from './webpack-test.conf';

module.exports = config => {
  config.set({
    singleRun: true,
    autoWatch: false,
    browsers: ['PhantomJS'],
    frameworks: ['mocha', 'sinon-chai'],
    reporters: ['progress', 'coverage'],
    files: ['../src/**/*.test.js*'],
    preprocessors: {
      '../src/**/*.test.js*': ['webpack', 'sourcemap']
    },
    client: {
      chai: { includeStack: true }
    },
    webpack: webpackConfig,
    webpackServer: { noInfo: true },
    phantomjsLauncher: { exitOnResourceError: true },
    coverageReporter: {
      dir: '../coverage',
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' }
      ],
      check: {
        global: {
           statements: 100,
           lines: 100,
           functions: 100,
           branches: 100
        }
      }
    }
  });
};
