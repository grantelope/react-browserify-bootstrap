'use strict';

const gulp = require('gulp'),
  gutil = require('gulp-util'),
  s3 = require('gulp-s3-ls'),
  gzip = require('gulp-gzip'),
  gulpif = require('gulp-if'),
  rename = require('gulp-rename');

function Task(conf, allConf, callback) {
  const aws = require('../aws.json'),
    tag = process.env.TAG;

  this.conf = conf;
  this.allConf = allConf;

  if (this.conf.requiresTag && !tag) {
    gutil.log("TAG must be set in the ENV");
    process.exit(1);
  }

  const options = {
    uploadPath: this.conf.uploadPath,
    gzippedOnly: this.conf.gzip || false
  };

  gulp.src(this.conf.files)
  .pipe(gulpif(this.conf.gzip, gzip()))
  .pipe(s3(aws, options));

  gulp.src(this.conf.files)
  .pipe(gulpif(this.conf.requiresTag, rename(function (path) {
    path.basename = path.basename + "-" + tag;
    return path;
  })))
  .pipe(gulpif(this.conf.gzip, gzip()))
  .pipe(s3(aws, options));

  callback();
}

module.exports = function (conf, allConf, callback) {
  return new Task(conf, allConf, callback);
};
