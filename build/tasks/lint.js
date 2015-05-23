var gulp    = require('gulp'); 
var path    = require('../paths'); 
var jshint  = require('gulp-jshint'); 
var stylish = require('jshint-stylish'); 


//lint - Runs jshint on js files
//-----------------------------------------------------------------------------
gulp.task('lint', function() 
{ 
    return gulp.src(path.js) 
               .pipe(jshint()) 
               .pipe(jshint.reporter(stylish)); 
}); 
