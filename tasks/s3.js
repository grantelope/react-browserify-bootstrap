var gulp = require('gulp'),
  aws = require('../aws.json'),

  s3 = require('gulp-s3-ls'),
  gzip = require('gulp-gzip'),

  config = require('../config.json')
;

module.exports = Task;

function Task(cb) {
  var options = {
    uploadPath: ['automat', 'public', 'css', ''].join('/'),
    gzippedOnly: true
  };

  gulp.src(config.paths.dist + '/css/**')
  .pipe(gzip())
  .pipe(s3(aws, options));

  cb();
}