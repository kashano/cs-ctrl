var path        = require('../paths');
var gulp        = require('gulp');
var runSequence = require('run-sequence');
var changed     = require('gulp-changed');
var concat      = require('gulp-concat');
var minCSS      = require('gulp-minify-css');
var sass        = require('gulp-sass');
var plumber     = require('gulp-plumber');
var sourcemaps  = require('gulp-sourcemaps');
var to5         = require('gulp-babel');
var compilerOps = require('../babel-options');


//build-html - Copies changed html files to the output directory
//-----------------------------------------------------------------------------
gulp.task('build-html', function ()
{
    return gulp.src(path.html)
               .pipe(changed(path.output))
               .pipe(gulp.dest(path.output));
});


//build-img - Copies changed img files to the output directory
//-----------------------------------------------------------------------------
gulp.task('build-img', function ()
{
    return gulp.src(path.img)
               .pipe(changed(path.output))
               .pipe(gulp.dest(path.output));
});



//build-style - Builds css
//-----------------------------------------------------------------------------
gulp.task('build-style', function ()
{
    return gulp.src(path.style)
               .pipe(plumber())
               .pipe(concat('app.css'))
               .pipe(sass())
               .pipe(minCSS())
               .pipe(gulp.dest(path.output));
});


//build-js - Builds changed js files to the output directory
//-----------------------------------------------------------------------------
gulp.task('build-js', function ()
{
    return gulp.src(path.js)
               .pipe(plumber()) 
               .pipe(changed(path.output))
               .pipe(sourcemaps.init()) 
               .pipe(to5(compilerOps)) 
               .pipe(sourcemaps.write('./'))
               .pipe(gulp.dest(path.output));
});



//Calls the clean task, then runs the build-* tasks in parallel
gulp.task('build', function (callback)
{
  return runSequence(
   // 'clean',
    ['build-style', 'build-html', 'build-js', 'build-img'],
    callback
  );
});
