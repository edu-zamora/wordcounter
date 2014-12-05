(function () {

  'use strict';

  var gulp = require('gulp'),
      jshint = require('gulp-jshint'),
      jscs = require('gulp-jscs'),
      rename = require('gulp-rename'),
      uglify = require('gulp-uglify'),
      replace = require('gulp-replace'),
      csslint = require('gulp-csslint'),
      cssmin = require('gulp-cssmin'),
      htmlmin = require('gulp-htmlmin'),
      nodeunit = require('gulp-nodeunit'),
      del = require('del'),
      fs = require('fs'),
      readJSON = function (path) {
        if (fs.existsSync(path)) {
          return JSON.parse(fs.readFileSync(path));
        }
      },
      pkg = readJSON('package.json'),
      jshintOptions = readJSON('.jshintrc'),
      jscsOptions = readJSON('.jscsrc'),
      csslintOptions = readJSON('.csslintrc');

  gulp.task('clean', function (cb) {
    return del(['dist', '_gh_pages'], function (err) {
      if (err) {
        return cb(err);
      }

      cb();
    });
  });

  gulp.task('check', function () {
    return gulp.src(['*.js', 'test/*.js', 'src/*.js', 'docs/js/docs.js'])
    .pipe(jshint(jshintOptions))
    .pipe(jshint.reporter('default'))
    .pipe(jscs(jscsOptions));
  });

  gulp.task('test', ['check'], function () {
    return gulp.src('test/*.js')
    .pipe(nodeunit());
  });

  gulp.task('copy', ['clean'], function () {
    return gulp.src('src/*.js')
    .pipe(replace(/@\w+/g, function (placeholder) {
      switch (placeholder) {
        case '@VERSION':
          placeholder = pkg.version;
          break;

        case '@DATE':
          placeholder = new Date().toISOString();
          break;
      }

      return placeholder;
    }))
    .pipe(gulp.dest('dist'));
  });

  gulp.task('compress', ['test', 'copy'], function () {
    return gulp.src('dist/*.js')
    .pipe(uglify({
      preserveComments: 'some'
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist'));
  });

  gulp.task('sync', ['compress'], function () {
    return gulp.src('dist/*.js')
    .pipe(gulp.dest('docs/js'))
    .pipe(gulp.dest('_gh_pages/js'));
  });

  gulp.task('docs.img', function () {
    return gulp.src('docs/img/*')
    .pipe(gulp.dest('_gh_pages/img'));
  });

  gulp.task('docs.css', function () {
    return gulp.src('docs/css/docs.css')
    // .pipe(csslint('.csslintrc'))
    .pipe(csslint(csslintOptions))
    .pipe(csslint.reporter())
    .pipe(cssmin())
    .pipe(gulp.dest('_gh_pages/css'));
  });

  gulp.task('docs.js', function () {
    return gulp.src('docs/js/docs.js')
    .pipe(jshint(jshintOptions))
    .pipe(jshint.reporter())
    .pipe(uglify())
    .pipe(gulp.dest('_gh_pages/js'));
  });

  gulp.task('docs', ['copy', 'docs.img', 'docs.css', 'docs.js'], function () {
    return gulp.src('docs/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      collapseBooleanAttributes: true
    }))
    .pipe(gulp.dest('_gh_pages'));
  });

  gulp.task('default', ['sync', 'docs']);

})();
