var path       = require('../paths');
var gulp       = require('gulp'); 
var del        = require('del'); 
 
//clean - Deletes all files in the output path 
//-----------------------------------------------------------------------------
gulp.task('clean', function(cb) 
{ 
    return del(path.clean, cb);
}); 