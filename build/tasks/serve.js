var gulp        = require('gulp'); 
var browserSync = require('browser-sync'); 
 
 
//serve - Runs build, then uses browser-sync to create a server at http://localhost:9000 
//-----------------------------------------------------------------------------
gulp.task('serve', ['build'], function(done) 
{ 
    browserSync(
    { 
        open: false, 
        port: 9000, 
        server: 
        { 
            baseDir: ['./dist'], 
            middleware: function (req, res, next) 
            { 
                res.setHeader('Access-Control-Allow-Origin', '*'); 
                next(); 
            } 
        } 
    }, done); 
 });