'use strict';

const gulp = require('gulp'),
  template = require('gulp-template'),
  gutil = require('gulp-util'),
  watch = require('gulp-watch');

module.exports = function () {
  function doTask() {
    const files = [{
      file: './templates/app.html',
      dest: '../'
    }];

    files.forEach(function (file) {
      const stream = gulp.src(file.file)
        .pipe(template({
          url: '',
          hash: process.env.GIT_HASH
        }))
        .pipe(gulp.dest(file.dest));

      stream.on('end', function () {
        gutil.log(gutil.colors.blue('template replaced'));
      });
    });
  }

  if (process.env.WATCH) {
    watch('./templates/*.html', function () {
      doTask();
    });
  }

  doTask();
};
