/*
 *  we define several file IO methods here as promises
 */
var Q = require('q'),
    fs = require('fs'),
    DeferredFactory = require('./deferredfactory');

var api = {};

api.readFile = DeferredFactory( fs.readFile, fs );
api.writeFile = DeferredFactory( fs.writeFile, fs );
api.readDir = DeferredFactory( fs.readdir, fs );

module.exports = api;
