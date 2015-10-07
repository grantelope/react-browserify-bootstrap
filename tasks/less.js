var del = require('del'),
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

module.exports = Task;

function onError(err) {
  gutil.beep();
  console.log(err);
  this.emit('end');
};

module.exports = function (conf, allConf, callback) {
  return new Task(conf, allConf, callback);
}

function Task(conf, allConf, callback) {
  this.conf = conf;
  this.allConf = allConf;
  this.newFileName = [this.conf.filename, process.env.GIT_HASH, 'css'].join('.');
  this.run(callback);
}

Task.prototype.run = function (callback) {
  var self = this;

  this.removeOld().then(function () {
    self.build();
  });

  if (process.env.WATCH) {
    watch(this.conf.watch, function() {
      self.build();
    });
  } else {
    callback();
  }
};

Task.prototype.removeOld = function () {
  return del([ this.conf.dist + '/' + this.conf.filename + '.*.*'], { force: true });
};

Task.prototype.build = function () {
  var self = this;

  gulp.src(self.conf.src)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(less({
      plugins: cleancss,
      compress: true,
      modifyVars: {'@git-hash': process.env.GIT_HASH}
    }))
    .pipe(gulpif(self.conf.autoprefixer, autoprefixer(self.conf.autoprefixer)))
    .pipe(gulpif(self.conf.base64, base64(self.conf.base64)))
    .pipe(rename(self.newFileName))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(self.conf.dist));

};
