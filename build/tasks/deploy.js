var gulp    = require('gulp');
var path    = require('../paths');
var ghPages = require('gulp-gh-pages');
 
gulp.task('deploy', function() 
{
  return gulp.src(path.deploy)
    .pipe(ghPages());
});
