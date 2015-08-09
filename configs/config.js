module.exports = {
    input: '/content/',
    output: '/static/',
    nav: '/configs/nav.json',
    getDir: __dirname.split('/').filter(function(el,idx) {
        return ( idx < __dirname.split('/').length-1 );
    }).join('/'),
    navpartial: '/configs/nav.partial',
    headerpartial: '/configs/header.partial',
    containerpartial: '/configs/container.partial',
    footerpartial: '/configs/footer.partial',
    editor: '/Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl',
    editorArgs: [ '-w' ]
};
