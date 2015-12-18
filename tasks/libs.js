'use strict';

const browserify = require('browserify'),
  buffer = require('vinyl-buffer'),
  del = require('del'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  source = require('vinyl-source-stream'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify');

function Task(conf, allConf, callback) {
  this.conf = conf;
  this.allConf = allConf;
  this.newFileName = [this.conf.filename, process.env.GIT_HASH, 'js'].join('.');

  this.run(callback);

  return this;
}

Task.prototype.run = function (cb) {
  this.removeOld().then(function () {
    this.bundle();
  }.bind(this));

  cb();
};

Task.prototype.bundle = function () {
  const libs = browserify();

  this.conf.libs.forEach(function (dep) {
    libs.require(dep);
  });

  const stream = libs
    .bundle()
    .pipe(source(this.newFileName))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify({
      mangle: true,
      preserveComments: false
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(this.conf.dist));

  stream.on('end', function () {
    gutil.log(gutil.colors.blue(this.conf.dist + '/' + this.newFileName + ' compiled!'));
  }.bind(this)).on("error", function (error) {
    gutil.log(gutil.colors.red("Error: "), error);
  });
};

Task.prototype.removeOld = function () {
  return del([this.conf.dist + '/' + this.conf.filename + '.*.*'], {
    force: true
  });
};

module.exports = function (conf, allConf, callback) {
  return new Task(conf, allConf, callback);
};
