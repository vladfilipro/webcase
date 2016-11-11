'use strict'

var path = require( 'path' )
var packageJson = require( __dirname + '/../package.json' )

var templateList = require( __dirname + '/../lib/utils.js' ).getTemplates()

module.exports = {
  'list': [ {
    'action': 'output',
    'config': {
      'text': JSON.stringify( templateList )
    }
  } ],
  'init': [ {
    'action': 'copy',
    'config': {
      'source': __dirname + '/templates',
      'destination': './'
    }
  }, {
    'action': 'rename',
    'config': {
      'files': [ {
        'from': './_package.json',
        'to': './package.json'
      }, {
        'from': './_.gitignore',
        'to': './.gitignore'
      } ]
    }
  }, {
    'action': 'parameters',
    'config': {
      'files': [
        './intro.txt',
        './help.txt',
        './package.json',
        './templates/readme.md',
        './readme.md'
      ],
      'keywords': {
        'name': path.resolve( '.' ).split( path.sep ).pop().replace( 'webcase-', '' ),
        'version': packageJson.version
      }
    }
  } ]
}
