var gulp       = require('gulp'); 
var path       = require('../paths'); 
var del        = require('del'); 
var vinylPaths = require('vinyl-paths'); 
 
 
//clean - Deletes all files in the output path 
//-----------------------------------------------------------------------------
gulp.task('clean', function() 
{ 
    return gulp.src(path.clean)
               .pipe(vinylPaths(del));

}); 
