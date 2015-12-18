'use strict';

const gulp = require('gulp');

function Task(conf, allConf, callback) {
  this.conf = conf;
  this.allConf = allConf;

  gulp.src(this.conf.files).pipe(gulp.dest(this.conf.dist));
  callback();
}

module.exports = function (conf, allConf, callback) {
  return new Task(conf, allConf, callback);
};
