'use strict';

const gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  inlineCss = require('gulp-inline-css'),
  cheerio = require('gulp-cheerio'),
  extname = require('gulp-extname'),
  watch = require('gulp-watch'),
  gutil = require('gulp-util'),
  gulpif = require('gulp-if'),
  gulpsmith = require('gulpsmith'),
  helpers = require('./helpers'),
  metalSmithLayouts = require('metalsmith-layouts'),
  metalsmithRegisterPartials = require('metalsmith-register-partials');

function onError(err) {
  gutil.beep(err);
  this.emit('end');
}

function Task(conf, allConf, callback) {
  this.conf = conf;
  this.allConf = allConf;

  this.run(callback);
}

Task.prototype.run = function (callback) {
  this.build();

  if (process.env.WATCH) {
    watch(this.conf.watch, function () {
      this.build();
    }.bind(this));
  } else {
    callback();
  }
};

Task.prototype.build = function () {
  gulp.src(this.conf.src)
  .pipe(plumber({errorHandler: onError}))
  .pipe(gulpsmith()
    .use(metalsmithRegisterPartials({
      directory: this.conf.partials
    }))
    .use(metalSmithLayouts(this.conf.layouts))
  )
  .pipe(extname())
  .pipe(inlineCss())
  .pipe(gulpif(this.conf.cheerio, cheerio({
    run: helpers[this.conf.cheerio.func] || function () {},
    parserOptions: this.conf.cheerio.parserOptions
  })))
  .pipe(gulp.dest(this.conf.dist));
};

module.exports = function (conf, allConf, callback) {
  return new Task(conf, allConf, callback);
};
