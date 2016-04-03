#!/usr/bin/env node

'use strict';

var parameters = process.argv;

var fs = require( 'fs' );
var execute = require( __dirname + '/lib' );
var utils = require( __dirname + '/lib/utils.js' );

// We need to make sure we are not installing in the wrong place
( function checkFolder() {
    var location = fs.readdirSync( './' );
    if ( !( ( location.length === 0 ) || ( location.length === 1 && location[ 0 ] === '.git' ) ) ) {
        utils.out.die( 'The current directory is not empty. Please make sure the ' +
            'directory is empty before generating a template. ' +
            'WE WOULDN\'T WANT TO BREAK SOME EXISTING STUFF, WOULD WE?!' );
        throw '';
    }
} )();

// Generate a list of available templates
var templates = utils.getTemplates();

var template = parameters[ 2 ];
var command = parameters[ 3 ];

// Check the command line arguments
if ( templates[ template ] ) {

    //Standard package template
    execute( 'webcase-' + template, template, command );
} else if ( template === 'template' ) {

    //Default Template
    execute( __dirname + '/' + template, template, command );
} else {

    //Fallback
    utils.out.log( utils.readFile( __dirname + '/help.txt', 'utf8' ) );
}
