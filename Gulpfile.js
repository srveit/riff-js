'use strict';
var gulp = require('gulp'),
  plugins = require('gulp-load-plugins')(),
  SpecReporter = require('jasmine-spec-reporter'),
  config = {};

config.paths = {
  coverage: 'reports',
  doc: 'docs'
};

config.lint = {
  js: {
    node: true,
    evil: false,
    indent: 2,
    passfail: false,
    predef: ['module', 'require', 'describe', 'beforeEach', 'it', 'expect', 'xit', 'fit'],
    terse: true,
    nomen: true
  }
};

config.files = {
  js: [
    'riff.js',
    'riff/**/*.js'
  ],
  tests: [
    'spec/**/*.js'
  ],
  lint: {
    js: [
      'bin/**/*.js',
      '*.js',
      'riff/**/*.js',
      'spec/**/*.js'
    ],
    json: [
      '**/*.json',
      '!node_modules/**/*'
    ]
  },
  doc: [
    'riff.js',
    'riff/**/*.js'
  ]
};
config.istanbul = {
  base: {
    includeUntested: true
  },
  reports: {
    dir: config.paths.coverage,
    reporters: [ 'lcov', 'text-summary' ],
    reportOpts: { dir: config.paths.coverage}
  },
  thresholds: {
    thresholds: {
      global: 7
    }
  }
};
config.jasmine = {
  verbose: true,
  includeStackTrace: true,
  reporter: new SpecReporter()
};

gulp.task('lint:js', function () {
  return gulp.src(config.files.lint.js)
    .pipe(plugins.jslint(config.lint.js));
});
function errorAlert(err) {
  console.log(err.toString(), this.isPaused());
  this.emit("end");
}
gulp.task('lint:js', function () {
  return gulp.src(config.files.lint.js)
    .pipe(plugins.jslint(config.lint.js))
    .on('error', errorAlert);
});

gulp.task('lint:json', function () {
  return gulp.src(config.files.lint.json)
    .pipe(plugins.jsonlint(config.lint.json))
    .pipe(plugins.jsonlint.reporter());
});

gulp.task('pre-test', function () {
  return gulp.src(config.files.js)
    .pipe(plugins.istanbul(config.istanbul.base))
    .pipe(plugins.istanbul.hookRequire());
});

gulp.task('post-test', function () {
  config.jasmine.reporter = new SpecReporter();
  return gulp.src(config.files.tests)
    .pipe(plugins.jasmine(config.jasmine))
    .pipe(plugins.istanbul.writeReports(config.istanbul.reports))
    .pipe(plugins.istanbul.enforceThresholds(config.istanbul.thresholds));
});

gulp.task('test', gulp.series(
  'pre-test',
  'post-test'
));

gulp.task('test:watch', function () {
  gulp.watch(config.files.tests.concat([config.files.js]),
             gulp.series('test'));
});


gulp.task('lint', gulp.parallel(
  'lint:js',
  'lint:json'
));

gulp.task('jsdoc', function () {
  return gulp.src(config.files.doc, {read: false})
    .pipe(plugins.shell([
      'jsdoc -d <%= config.paths.doc %> riff.js riff/*.js'
    ], {
      templateData: {
        config: config
      }
    }));
});

gulp.task('default', gulp.series(
  'lint',
  'test',
  'jsdoc'
));
