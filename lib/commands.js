'use strict'

var utils = require( __dirname + '/utils.js' )
var childProcess = require( 'child_process' )

module.exports = {
  'output': function ( config ) {
    utils.out.log( config.text )
  },
  'copy': function ( config ) {
    utils.copy( config.source, config.destination )
  },
  'rename': function ( config ) {
    var files = config.files
    for ( var i = 0; i < files.length; i++ ) {
      utils.rename( files[ i ].from, files[ i ].to )
    }
  },
  'parameters': function ( config ) {
    var contents
    for ( var i = 0; i < config.files.length; i++ ) {
      contents = utils.readFile( config.files[ i ] )
      for ( var key in config.keywords ) {
        if ( config.keywords.hasOwnProperty( key ) ) {
          contents = contents.replace( new RegExp( '<%\\s*?' + key + '\\s*?%>', 'gi' ), config.keywords[ key ] )
        }
      }
      utils.writeFile( config.files[ i ], contents )
      utils.out.log( 'file ' + config.files[ i ] + ' updated with parameters' )
    }
  },
  'run': function ( config ) {
    childProcess.execSync( config.command, {
      stdio: [ 0, 1, 2 ]
    } )
  }
}
