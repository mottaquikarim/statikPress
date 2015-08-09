/*
 *  this is a commandline script to be run
 *  it creates a new entry in configs/config.navlist
 *  then, creates a corresponding entry in configs/config.input
 *  then, spawns the entry in configs/config.editor
 */

var NavIO = require('./navio'),
    config = require('../configs/config'),
    program = require('commander'),
    colors = require('colors');

program
    .version('0.0.1')
    .option('-n, --new [file]', 'New Entry')
    .option('-p, --position [position]', 'Position for entry')
    .parse(process.argv);

if ( typeof program.new === "undefined" ) {
    throw new Error( "Entry must be defined!".red );
}

NavIO.addEntry( program.new, program.position )
.then(function() {
    console.log( "Success!".green );
    console.log( ("Starting Edit mode for " + program.new + "...").green );

    setTimeout(function() {
        config.editorArgs.push( config.getDir + config.input + program.new+'.md' );

        var editor = require('child_process').spawn(
            config.editor,
            config.editorArgs,
            {stdio: 'inherit'}
        );
        editor.on('exit', process.exit);
    }, 1000);
});

