'use strict'

/*
    Available actions

    action: 'copy'
    config: {
        source: string,
        destination: string
    }

    action: 'rename'
    config: {
        files: [{
            from: string,
            to: string
        }]
    }

    action: 'parameters'
    config: {
        files: [ array of strings ]
        keywords: {
            string Key: string Value
        }
    }

    action: 'run'
    config: {
        command: string
    }
*/

module.exports = {
  'init': [ {
    'action': 'copy',
    'config': {
      'source': __dirname + '/templates',
      'destination': './'
    }
  }, {
    'action': 'run',
    'config': {
      'command': 'npm install'
    }
  } ]
}
