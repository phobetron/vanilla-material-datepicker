import del from 'del';
import path from 'path';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import karma from 'karma';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import packageJson from './package.json';
import serveConfig from './conf/webpack.conf';
import distConfig from './conf/webpack-dist.conf';

const $ = gulpLoadPlugins({ camelize: true });

gulp.task('serve', () => runSequence('serve:clean', 'serve:start'));
gulp.task('dist', () => runSequence('dist:clean', 'dist:build'));
gulp.task('clean', ['dist:clean', 'serve:clean']);
gulp.task('test', done => {
  new karma.Server({ configFile: __dirname + '/conf/karma.conf.js' }, done).start();
});

gulp.task('serve:clean', cb => del('.tmp', { dot: true }, cb));
gulp.task('serve:start', () => {
  const config = serveConfig;

  return new WebpackDevServer(webpack(config), {
    contentBase: '.tmp',
    publicPath: config.output.publicPath,
    quiet: false,
    noInfo: true
  })
    .listen(8080, '0.0.0.0', err => {
      if (err) throw new $.util.PluginError('webpack-dev-server', err);

      $.util.log(`[${packageJson.name} serve]`, 'Listening at 0.0.0.0:8080');
    });
});

gulp.task('dist:clean', cb => del('dist', { dot: true }, cb));
gulp.task('dist:build', cb => {
  webpack(distConfig, (err, stats) => {
    if (err) throw new $.util.PluginError('dist', err);

    $.util.log(`[${packageJson.name} dist]`, stats.toString({ colors: true }));

    cb();
  });
});
