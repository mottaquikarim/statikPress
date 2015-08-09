/*
 *  this class handles adding an entry to configs/nav.json
 */
var config = require('../configs/config'),
    FileIO = require('./fileio'),
    Q = require('q');

var api = {};

function _createNavList() {
    var obj = {};
    obj.nav = [];
    return obj;
}

function _handleNavListUpdate( data, title, position ) {
    var obj = JSON.parse( data ),
        isInvalid = typeof position !== "undefined" 
                  || position < 0
                  || position > obj.nav.length;
    if ( isInvalid ) {
        obj.nav.push( title );
    }
    else {
        obj.nav.splice( position, 0, title );
    }

    return obj;
}

api.addEntry = function addEntry( title, position ) {
    return FileIO.readFile( config.getDir + config.nav, 'utf-8' )
            .then(function(data) {
                var obj;

                if ( !!data ) {
                   obj = _handleNavListUpdate( data, title, position ); 
                }
                else {
                    obj = _createNavList();
                    obj.nav.push( title );
                }

                return FileIO.writeFile(
                    config.getDir + config.nav,
                    JSON.stringify( obj )
                );
            })
            .then(function() {
                return FileIO.writeFile( config.getDir + config.input + title + '.md', '' );
            });
}; // addEntry

module.exports = api;
