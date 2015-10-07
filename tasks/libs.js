var _ = require('lodash'),
  browserify = require('browserify'),
  buffer = require('vinyl-buffer'),
  del = require('del'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  rename = require('gulp-rename'),
  source = require('vinyl-source-stream'),
  watchify = require('watchify'),
  path = require('path'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),

  pkg = require('../package.json');


module.exports = function (conf, allConf, callback) {
  return new Task(conf, allConf, callback);
}

function Task(conf, allConf, callback) {

  this.conf = conf;
  this.allConf = allConf;
  this.newFileName = [this.conf.filename, process.env.GIT_HASH, 'js'].join('.');

  this.run(callback);
  return this;
};

Task.prototype.run = function(cb) {
  var self = this;

  this.removeOld().then(function() {
    self.bundle();
  });

  cb();
};

Task.prototype.bundle = function () {

  var self = this,
    libs = browserify();

  this.conf.libs.forEach(function (dep) {
    libs.require(dep);
  });

  var stream = libs
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

    stream.on('end', function() {
      gutil.log(gutil.colors.blue(self.conf.dist + '/' + self.newFileName+' compiled!'));
    }).on("error", function(error) {
      gutil.log(gutil.colors.red("Error: "), error);
    });

};

Task.prototype.removeOld = function () {
  return del([ this.conf.dist + '/' + this.conf.filename + '.*.*'], { force: true });
};
