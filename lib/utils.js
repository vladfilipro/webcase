'use strict'

var fs = require( 'fs' )
var childProcess = require( 'child_process' )
var copyDir = require( __dirname + '/copyDir.js' )

var colors = {
  'reset': '0',
  'hicolor': '1',
  'underline': '4',
  'inverse': '7',
  'black': '30',
  'red': '31',
  'green': '32',
  'yellow': '33',
  'blue': '34',
  'magenta': '35',
  'cyan': '36',
  'white': '37',
  'bg_black': '40',
  'bg_red': '41',
  'bg_green': '42',
  'bg_yellow': '43',
  'bg_blue': '44',
  'bg_magenta': '45',
  'bg_cyan': '46',
  'bg_white': '47'
}

var c = function ( style ) {
  return '\x1B[' + colors[style] + 'm'
}

var utils = {
  out: {
    log: function ( text ) {
      console.log( c( 'hicolor' ) + text + c( 'reset' ) )
    },
    action: function ( text ) {
      console.log( c( 'cyan' ) + '==' + text + '==' + c( 'reset' ) )
    },
    step: function ( text ) {
      console.log( c( 'yellow' ) + '>> ' + text + c( 'reset' ) )
    },
    title: function ( text ) {
      console.log( c( 'green' ) + text + c( 'reset' ) )
    },
    error: function ( text ) {
      console.log( c( 'red' ) + ' ! ' + text + c( 'reset' ) )
    },
    die: function ( text ) {
      throw new Error( text )
    }
  },
  isDirectory: function ( path, dontDie ) {
    var stats
    try {
      stats = fs.lstatSync( path )
      if ( stats.isDirectory ) {
        return true
      } else {
        return false
      }
    } catch ( e ) {
      if ( dontDie ) {
        utils.out.error( 'Path does not exists ' + path )
      } else {
        utils.out.die( 'Path does not exists ' + path )
      }
      return false
    }
  },
  copy: function ( src, dest ) {
    copyDir.sync( src, dest, function ( _stat, _path ) {
      if ( _stat === 'file' ) {
        utils.out.log( 'copying file ' + _path )
      }
      return true
    }, function () {
      utils.out.log( 'Files copied.' )
    } )
  },
  rename: function ( src, dest ) {
    try {
      fs.renameSync( src, dest )
      utils.out.log( 'file renamed from ' + src + ' to ' + dest )
    } catch ( e ) {
      utils.out.error( colors.red( e ) )
    }
  },
  readFile: function ( file ) {
    try {
      return fs.readFileSync( file, 'utf8' )
    } catch ( e ) {
      utils.out.error( colors.red( e ) )
    }
    return false
  },
  writeFile: function ( file, data ) {
    try {
      fs.writeFileSync( file, data, 'utf8' )
    } catch ( e ) {
      utils.out.error( colors.red( e ) )
    }
  },
  getTemplates: function () {
    var output = childProcess.execSync( 'npm list -g -json -depth=0' )
    var dependencies = JSON.parse( output ).dependencies
    var results = {}
    for ( var dependency in dependencies ) {
      if ( dependencies.hasOwnProperty( dependency ) && dependency.match( /^webcase-(.*?)$/ig ) ) {
        results[ dependency.replace( /^webcase-/gi, '' ) ] = dependencies[ dependency ].version
      }
    }
    return results
  }

}
module.exports = utils
