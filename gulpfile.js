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
      pkg = JSON.parse(fs.readFileSync('package.json')),
      jshintOptions = JSON.parse(fs.readFileSync('.jshintrc')),
      jscsOptions = JSON.parse(fs.readFileSync('.jscsrc')),
      csslintOptions = JSON.parse(fs.readFileSync('.csslintrc'));

  gulp.task('clean', function (cb) {
    return del(['dist', '_gh_pages'], cb);
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

        case '@YEAR':
          placeholder = (new Date()).getFullYear();
          break;

        case '@DATE':
          placeholder = (new Date()).toISOString();
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

  gulp.task('release', ['compress'], function () {
    return gulp.src('dist/*.js')
    .pipe(gulp.dest('releases/' + pkg.version));
  });

  gulp.task('sync', ['compress'], function () {
    return gulp.src('dist/*.js')
    .pipe(gulp.dest('docs/js'))
    .pipe(gulp.dest('_gh_pages/js'));
  });

  gulp.task('docs.img', ['clean'], function () {
    return gulp.src('docs/img/*')
    .pipe(gulp.dest('_gh_pages/img'));
  });

  gulp.task('docs.css', ['clean'], function () {
    return gulp.src('docs/css/docs.css')
    // .pipe(csslint('.csslintrc'))
    .pipe(csslint(csslintOptions))
    .pipe(csslint.reporter())
    .pipe(cssmin())
    .pipe(gulp.dest('_gh_pages/css'));
  });

  gulp.task('docs.js', ['clean'], function () {
    return gulp.src('docs/js/docs.js')
    .pipe(jshint(jshintOptions))
    .pipe(jshint.reporter())
    .pipe(uglify())
    .pipe(gulp.dest('_gh_pages/js'));
  });

  gulp.task('docs.misc', ['clean'], function () {
    return gulp.src('docs/js/jquery.js')
    .pipe(gulp.dest('_gh_pages/js'));
  });

  gulp.task('docs', ['docs.img', 'docs.css', 'docs.js', 'docs.misc'], function () {
    return gulp.src('docs/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      collapseBooleanAttributes: true
    }))
    .pipe(gulp.dest('_gh_pages'));
  });

  gulp.task('default', ['sync', 'docs']);

})();
