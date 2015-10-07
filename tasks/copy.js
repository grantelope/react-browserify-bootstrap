var gulp = require('gulp'),
  pkg = require('../package.json');

module.exports = function (conf, allConf, callback) {
  return new Task(conf, allConf, callback);
}

function Task(conf, allConf, callback) {

  this.conf = conf;
  this.allConf = allConf;

  gulp.src(this.conf.files).pipe(gulp.dest(this.conf.dist));
  
  callback();
}