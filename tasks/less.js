'use strict';

const del = require('del'),
  less = require('gulp-less'),
  LessPluginCleanCSS = require("less-plugin-clean-css"),
  cleancss = new LessPluginCleanCSS({
    advanced: true,
    keepSpecialComments: 0
  }),

  gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  rename = require('gulp-rename'),
  base64 = require('gulp-base64'),
  autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  watch = require('gulp-watch'),
  gutil = require('gulp-util'),
  gulpif = require('gulp-if');

function onError(err) {
  gutil.beep(err);
  this.emit('end');
}

function Task(conf, allConf, callback) {
  this.conf = conf;
  this.allConf = allConf;
  this.newFileName = [this.conf.filename, process.env.GIT_HASH, 'css'].join('.');
  this.run(callback);
}

Task.prototype.run = function (callback) {
  this.removeOld().then(function () {
    this.build();
  }.bind(this));

  if (process.env.WATCH) {
    watch(this.conf.watch, function () {
      this.build();
    }.bind(this));
  } else {
    callback();
  }
};

Task.prototype.removeOld = function () {
  return del([this.conf.dist + '/' + this.conf.filename + '.*.*'], {
    force: true
  });
};

Task.prototype.build = function () {
  gulp.src(this.conf.src)
    .pipe(plumber({errorHandler: onError}))
    .pipe(sourcemaps.init())
    .pipe(less({
      plugins: cleancss,
      compress: true,
      modifyVars: {'@git-hash': process.env.GIT_HASH}
    }))
    .pipe(gulpif(this.conf.autoprefixer, autoprefixer(this.conf.autoprefixer)))
    .pipe(gulpif(this.conf.base64, base64(this.conf.base64)))
    .pipe(rename(this.newFileName))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(this.conf.dist));
};

module.exports = function (conf, allConf, callback) {
  return new Task(conf, allConf, callback);
};
