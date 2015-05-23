var srcRoot = 'src/';

module.exports =
{
    root   : srcRoot,
    js     : srcRoot + '**/*.js',
    img    : [srcRoot + '**/*.png', srcRoot + '**/*.jpg', srcRoot + '**/*.svg'],
    html   : srcRoot + '**/*.html',
    style  : srcRoot + '**/*.scss',
    output : 'dist/'
};
