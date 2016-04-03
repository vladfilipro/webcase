'use strict';

var fs = require( 'fs' );
var colors = require( 'colors' );
var copyDir = require( 'copy-dir' );
var child_process = require( 'child_process' );

var utils = {
    out: {
        log: function( text ) {
            console.log( colors.white( text ) );
        },
        action: function( text ) {
            console.log( colors.cyan( '==', text, '==' ) );
        },
        step: function( text ) {
            console.log( colors.yellow( '>> ', text ) );
        },
        title: function( text ) {
            console.log( colors.green( text ) );
        },
        error: function( text ) {
            console.log( colors.red( ' ! ', text ) );
        },
        die: function( text ) {
            throw text;
        },
    },
    isDirectory: function( path, dontDie ) {
        var stats;
        try {
            stats = fs.lstatSync( path );
            if ( stats.isDirectory ) {
                return true;
            } else {
                return false;
            }
        } catch ( e ) {
            if ( dontDie ) {
                utils.out.error( 'Path does not exists ' + path );
            } else {
                utils.out.die( 'Path does not exists ' + path );
            }
            return false;
        }
    },
    copy: function( src, dest ) {
        copyDir.sync( src, dest, function( _stat, _path ) {
            if ( _stat === 'file' ) {
                utils.out.log( 'copying file ' + _path );
            }
            return true;
        }, function() {
            utils.out.log( 'Files copied.' );
        } );
    },
    rename: function( src, dest ) {
        try {
            fs.renameSync( src, dest );
            utils.out.log( 'file renamed from ' + src + ' to ' + dest );
        } catch ( e ) {
            utils.out.error( colors.red( e ) );
        }
    },
    readFile: function( file ) {
        try {
            return fs.readFileSync( file, 'utf8' );
        } catch ( e ) {
            utils.out.error( colors.red( e ) );
        }
        return false;
    },
    writeFile: function( file, data ) {
        try {
            fs.writeFileSync( file, data, 'utf8' );
        } catch ( e ) {
            utils.out.error( colors.red( e ) );
        }
    },
    getTemplates: function() {
        var output = child_process.execSync( 'npm list -g -json -depth=0' );
        var dependencies = JSON.parse( output ).dependencies;
        var results = {};
        for ( var dependency in dependencies ) {
            if ( dependencies.hasOwnProperty( dependency ) && dependency.match( /^webcase-(.*?)$/ig ) ) {
                results[ dependency.replace( /^webcase-/gi, '' ) ] = dependencies[ dependency ].version;
            }
        }
        return results;
    }

};
module.exports = utils;
