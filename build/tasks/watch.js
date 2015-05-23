var gulp = require('gulp');
var path = require('../paths');


//Outputs changes to files to the console
function reportChange(event)
{
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}



//watch - Watches for changes to files, builds them, & calls reportChange()
//-----------------------------------------------------------------------------
gulp.task('watch', ['build'], function ()
{
    gulp.watch(path.js, ['build-js']).on('change', reportChange);
    gulp.watch(path.html, ['build-html']).on('change', reportChange);
    gulp.watch(path.style, ['build-style']).on('change', reportChange);
    gulp.watch(path.img, ['build-img']).on('change', reportChange);
});
