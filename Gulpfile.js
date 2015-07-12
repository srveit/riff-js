'use strict';
var gulp = require('gulp'),
  watch = require('gulp-watch'),
  jslint = require('gulp-jslint'),
  jsSrc = ['bin/**/*.js', '*.js', 'riff/**/*.js', 'spec/**/*.js'],
  cmd = 'jslint bin/*.js riff.js riff/*.js spec/*.js; jasmine; jsdoc riff riff.js';

gulp.task('callback', function () {
    watch(jsSrc, function () {
      gulp.src(jsSrc)
        .pipe(jslint({
          node: true,
          evil: false,
          indent: 2,
          passfail: false,
          predef: ['module', 'require', 'describe', 'beforeEach', 'it', 'expect', 'xit', 'fit'],
          terse: true,
          nomen: true
        }))
        .on('error', function (error) {
          console.error(String(error));
        });
    });
});
gulp.task('default', function () {
  gulp.src(jsSrc)
    .pipe(watch(jsSrc))
    .pipe(jslint({
      node: true,
      evil: false,
      indent: 2,
      passfail: false,
      predef: ['module', 'require', 'describe', 'beforeEach', 'it', 'expect', 'xit', 'fit'],
      terse: true,
      nomen: true
    }))
    .on('error', function (error) {
      console.error(String(error));
    });
});
