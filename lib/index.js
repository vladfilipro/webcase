'use strict';

var fs = require( 'fs' );

var utils = require( './utils.js' );
var commands = require( './commands.js' );
var path = require( 'path' );

module.exports = function( templatePackage, template, action ) {
    var templateDirectory = path.dirname( require.resolve( templatePackage ) );

    // Get template directory
    if ( !utils.isDirectory( templateDirectory ) ) {
        utils.out.die( 'Unable to resolve template path' );
    }

    // Get configuration for template
    var config = require( templatePackage );
    if ( !config ) {
        utils.out.die( 'Unable to locate configuration file for template ' + template );
    }

    // Get action steps from configuration
    if ( !config[ action ] ) {
        utils.out.error( 'Invalid action ' + action + ' for template ' + template );
        utils.out.log( fs.readFileSync( templateDirectory + '/help.txt', 'utf8' ) );
        return;
    }

    // Show template intro
    utils.out.title( fs.readFileSync( templateDirectory + '/intro.txt', 'utf8' ) );

    // Execute steps
    var steps = config[ action ];
    utils.out.action( 'Executing action ' + action );
    for ( var i = 0; i < steps.length; i++ ) {
        utils.out.step( 'Running step ' + ( i + 1 ) + ' ' + steps[ i ].action );
        commands[ steps[ i ].action ]( steps[ i ].config );
    }

    utils.out.title( '>> Environment succesfully created. <<' );
};
