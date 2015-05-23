var srcRoot = 'src/';

module.exports =
{
    root   : srcRoot,
    js     : srcRoot + '**/*.js',
    img    : [srcRoot + '**/*.png', srcRoot + '**/*.jpg', srcRoot + '**/*.svg'],
    html   : srcRoot + '**/*.html',
    style  : srcRoot + '**/*.scss',
    deploy : ['./dist/**/*'],
    clean  : ['./dist/**/*', '!./dist/jspm_packages/**/*', '!./dist/config.js'],
    output : 'dist/'
};
