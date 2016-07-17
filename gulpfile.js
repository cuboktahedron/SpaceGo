var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var webpack = require('gulp-webpack');
var spawn = require('child_process').spawn;
var livereload = require('gulp-livereload');

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

var server = null;
gulp.task('server',function(){
  if(server){
    server.kill('SIGKILL');
  }
  server = spawn('node',['./bin/www']);
})

gulp.task('watch-client', function () {
  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('src/scripts/app/client/**/*.js', ['cjs']);
});

gulp.task('watch-server', ['server'], function() {
  livereload.listen();
  gulp.watch([
    'app.js',
    'routes/**/*.js',
    'src/scripts/app/server/**/*.js'
  ], ['server']);

  gulp.watch(['public/**/*', 'views/**/*'], ['reload']);
});

gulp.task('watch', ['watch-client', 'watch-server']);

gulp.task('reload',function(){
  gulp.src(['public/**/*','views/**/*'])
    .pipe(livereload());
})

gulp.task('default', ['cjs', 'sass']);
