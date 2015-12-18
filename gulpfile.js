'use strict';

const _ = require('lodash'),
  argv = require('yargs').argv,
  git = require('git-rev-sync'),
  gulp = require('gulp'),
  taskConfig = require('./tasks/config.json');

const AppTask = require('./tasks/app'),
  LibsTask = require('./tasks/libs'),
  CopyTask = require('./tasks/copy'),
  LessTask = require('./tasks/less'),
  s3Task = require('./tasks/s3');

let args, hash, allTasks = [];

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
  allTasks.push(appName);

  gulp.task(appName, function (callback) {
    LessTask(conf, taskConfig, callback);
  });
});

_.each(taskConfig.s3, function (conf, appName) {
  gulp.task(appName, function (callback) {
    s3Task(conf, taskConfig, callback);
  });
});

gulp.task('template', require('./tasks/template'));
allTasks.push('template');

hash = argv.hash || git.short();

process.env.NODE_ENV = argv.dev ? 'development' : '';

/* if it starts w/ an integer, LESS does weird things */
process.env.GIT_HASH = 'x' + hash;
process.env.WATCH = argv.watch || '';

args = argv._.length > 0 ? argv._ : allTasks;
args = _.intersection(args, allTasks);

gulp.task('default', args);
