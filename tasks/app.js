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
  this.appBundler = null;
  this.newFileName = [this.conf.filename, process.env.GIT_HASH, 'js'].join('.');

  this.run(callback);
  return this;
};

Task.prototype.init = function () {

  var self = this,
    args = {
      entries: this.conf.entries,
      paths: ['./'],
      debug: true
    },
    taskArgs = process.env.NODE_ENV ==='development' ? _.assign(args, watchify.args) : args,
    libsList = this.allConf.libs[this.conf.libs] || { libs: [] };

  this.appBundler = new browserify(taskArgs, { extensions: ['.js', '.json', '.jsx'] });

  libsList.libs.forEach(function (dep) {
    self.appBundler.external(dep);
  });

};

Task.prototype.run = function(cb) {
  
  var self = this;

  this.init();

  this.removeOld().then(function() {
    self.bundle();
  });

  if (process.env.WATCH) {
    this.appBundler = watchify(this.appBundler);

    this.appBundler
      .on('update', function() {
        gutil.log(gutil.colors.green(self.conf.dist + '/' + self.newFileName+' is rebundling...'));
        self.bundle();
      })
      .on('error', function(e) {
        gutil.log('Browserify Error', e);
      })
    ;

  } else {
    cb();
  }
};

Task.prototype.bundle = function () {

  var self = this,
    stream = this.appBundler
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

  stream.on('end', function() {
    gutil.log(gutil.colors.blue(self.conf.dist + '/' + self.newFileName+' compiled!'));
  }).on("error", function(error) {
    gutil.log(gutil.colors.red("Error: "), error);
  });
};

Task.prototype.removeOld = function () {
  return del([ this.conf.dist + '/' + this.conf.filename + '.*.*'], { force: true });
};
