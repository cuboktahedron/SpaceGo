var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var webpack = require('gulp-webpack');

gulp.task('cjs',function(){
  gulp.src(['src/scripts/app/client/*.js'])
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('public/javascripts/'))
})

gulp.task('sass',function(){
  gulp.src('src/sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass({style : 'expanded'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('watch', function () {
  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('src/scripts/app/client/**/*.js', ['cjs']);
});

gulp.task('default', ['cjs', 'sass']);
