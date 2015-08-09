/*
 *  this class is responsible to actually "pressing" our static site
 */
var Q = require('q'),
    _ = require('underscore'),
    colors = require('colors'),
    marked = require('marked'),

    FileIO = require('./fileio'),
    config = require('../configs/config'),
    DeferredFactory = require('./deferredfactory');

// read the nav first
FileIO.readFile( config.getDir + config.nav, 'utf-8' )
.then(function( data ) {
    // if nav contains data, we have material to "press"
    if ( !!data ) {
        data = JSON.parse( data ).nav;
        // this kicks off the actual process
        startGenerationChain( data );
    }
    // else, just throw an error
    else {
        console.log( 'No files added yet'.red );
    }
});
 
function startGenerationChain( nav ) {
    // globals to populate in the chain
    var compiled, nav, header, footer, container, containerCompiled;

    // first, grab the nav.partial template
    FileIO.readFile( config.getDir + config.navpartial, 'utf-8' )
    .then(function(data) {

        // generate nav html via underscore
        compiled = _.template( data );
        nav = compiled( { navListItems: nav } );

        // read the header and footer templates and container templates
        var arr = [
            FileIO.readFile( config.getDir + config.headerpartial, 'utf-8' ),
            FileIO.readFile( config.getDir + config.footerpartial, 'utf-8' ),
            FileIO.readFile( config.getDir + config.containerpartial, 'utf-8' )
        ];

        // promise on BOTH being read
        return Q.all( arr );
    })
    .then(function( returnables ) {
        // save the file data into our globals
        header = returnables.shift();
        footer = returnables.shift();
        container = returnables.shift();

        // NOTE: this would be the place to do any underscore tranform
        // magic if desired
        containerCompiled = _.template( container );

        // read all files in content dir
        return FileIO.readDir( config.getDir + config.input ); 
    })
    .then(function( files ) {
        console.log( files );
        // for each file, read then concatenate with header, nav, footer, then write
        // this will return once ALL have successfully completed
        return Q.all(files.reduce(function(ar, file) {
            file = file.split('.').shift();

            if ( file === '' ) return ar;

            ar.push(
                FileIO.readFile( config.getDir + config.input + file + '.md', 'utf-8' )
                .then(function( data ) {
                    var html = [
                        header,
                        nav,
                        containerCompiled( {data: marked( data )} ),
                        footer
                    ].join('\n');
                    
                    return FileIO.writeFile( config.getDir + config.output + file + '.html', html );
                })
            );

            return ar;
        }, []));
    })
    .then(function() {
        // if we made it here, we are solid
        console.log('Successfully Completed'.green);
    });
}
