'use strict';

const _ = require('lodash'),
  Browserify = require('browserify'),
  buffer = require('vinyl-buffer'),
  del = require('del'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  source = require('vinyl-source-stream'),
  watchify = require('watchify'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify');

function Task(conf, allConf, callback) {
  this.conf = conf;
  this.allConf = allConf;
  this.appBundler = null;
  this.newFileName = [this.conf.filename, process.env.GIT_HASH, 'js'].join('.');

  this.run(callback);
  return this;
}

Task.prototype.init = function () {
  const args = {
      entries: this.conf.entries,
      paths: ['./'],
      debug: true
    },
    taskArgs = process.env.NODE_ENV ==='development' ? _.assign(args, watchify.args) : args,
    libsList = this.allConf.libs[this.conf.libs] || {libs: []};

  this.appBundler = new Browserify(taskArgs, {extensions: ['.js', '.json', '.jsx']});

  libsList.libs.forEach(function (dep) {
    this.appBundler.external(dep);
  }.bind(this));
};

Task.prototype.run = function (cb) {
  this.init();

  this.removeOld().then(function () {
    this.bundle();
  }.bind(this));

  if (process.env.WATCH) {
    this.appBundler = watchify(this.appBundler);

    this.appBundler
      .on('update', function () {
        gutil.log(gutil.colors.green(this.conf.dist + '/' + this.newFileName+' is rebundling...'));
        this.bundle();
      }.bind(this))
      .on('error', function (e) {
        gutil.log('Browserify Error', e);
      });
  } else {
    cb();
  }
};

Task.prototype.bundle = function () {
  const stream = this.appBundler
    .bundle()
    .pipe(source(this.newFileName))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify({
      mangle: true,
      preserveComments: false
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(this.conf.dist))
  ;

  stream.on('end', function () {
    gutil.log(gutil.colors.blue(this.conf.dist + '/' + this.newFileName+' compiled!'));
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
