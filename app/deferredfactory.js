/*
 *  this is a utility function that automates promise making
 */
var Q = require('q');

module.exports = function( func, scope ) {
    return function() {
        var d = Q.defer();
        var args = [].slice.call( arguments );
        var callback = args.push(function( err, data ) {
            if ( err ) {
                throw new Error( err );
            }
            d.resolve( data );
        });

        func.apply( scope, args );

        return d.promise;
    };
};
