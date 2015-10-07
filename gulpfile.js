var _ = require('lodash'),
  argv = require('yargs').argv,
  git = require('git-rev-sync'),
  gulp = require('gulp'),
  taskConfig = require('./tasks/config.json');

var AppTask = require('./tasks/app'),
  LibsTask = require('./tasks/libs'),
  CopyTask = require('./tasks/copy'),
  LessTask = require('./tasks/less');

var allTasks = [];

_.each(taskConfig.app, function (conf, appName) {

  allTasks.push(appName);

  gulp.task(appName, function (callback) {
    AppTask(conf, taskConfig, callback);
  });
});

_.each(taskConfig.libs, function (conf, appName) {

  allTasks.push(appName);

  gulp.task(appName, function (callback) {
    LibsTask(conf, taskConfig, callback);
  });
});

_.each(taskConfig.copy, function (conf, appName) {
  
  allTasks.push(appName);

  gulp.task(appName, function (callback) {
    CopyTask(conf, taskConfig, callback);
  });
});

_.each(taskConfig.less, function (conf, appName) {
  gulp.task(appName, function (callback) {
    LessTask(conf, taskConfig, callback);
  });
});


var args, hash = 'hashy'; //argv.hash || git.short();

var production = argv.production || false;
process.env.NODE_ENV = argv.dev ? 'development' : '';
process.env.GIT_HASH = 'x' + hash; /* if it starts w/ an integer, LESS does weird things */
process.env.WATCH = argv.watch || '';

args = argv._.length > 0 ? argv._ : allTasks;
args = _.intersection(args, allTasks);
// gulp = require('./tasks')([].concat(args).concat(otherTasks));

gulp.task('default', args);