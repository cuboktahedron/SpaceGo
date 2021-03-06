var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var spawn = require('child_process').spawn;
var livereload = require('gulp-livereload');
var requirejsOptimize = require('gulp-requirejs-optimize');

var libs = {
  js: [
    'node_modules/jquery/dist/*.min.js',
    'node_modules/bootstrap/dist/js/*.min.js',
    'node_modules/requirejs/require.js',
    'node_modules/eventemitter2/lib/eventemitter2.js',
  ],
  css: [
    'node_modules/bootstrap/dist/css/*.min.css'
  ]
};

gulp.task('compile:lib', function() {
  gulp.src(libs.js)
    .pipe(gulp.dest('public/lib/js'));
  gulp.src(libs.css)
    .pipe(gulp.dest('public/lib/css'));
});

gulp.task('cjs',function(){
  gulp.src('src/scripts/app/client/main.js')
    .pipe(plumber())
    .pipe(requirejsOptimize({
      baseUrl: 'src/scripts',
      paths: {
        lib: '../../public/lib/js'
      },
      exclude: ['lib/eventemitter2'],
      name: 'app/client/main',
      optimize: 'none',
      out: "bundle.js"
    }))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/js/'))
})

gulp.task('sass',function(){
  gulp.src('src/sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass({style : 'expanded'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/css'));
});

var server = null;
gulp.task('server',function(){
  if(server){
    server.kill('SIGKILL');
  }
  server = spawn('node',['./bin/www']);
})

gulp.task('watch-client', ['sass', 'cjs'], function () {
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
