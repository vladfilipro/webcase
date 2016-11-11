var fs = require( 'fs' )
var path = require( 'path' )

var mkdir = function ( dist, callback ) {
  dist = path.resolve( dist )
  fs.exists( dist, function ( exists ) {
    if ( !exists ) {
      mkdir( path.dirname( dist ), function () {
        fs.mkdir( dist, function ( err ) {
          callback && callback( err )
        } )
      } )
    } else {
      callback && callback( null )
    }
  } )
}

function FileTools ( from, to, filter ) {
  this.from = from
  this.to = to
  this.filter = filter
  return this
}

FileTools.prototype.find = function ( callback ) {
  var that = this
  var filelist = {
    dirs: [],
    files: []
  }
  var getfiles = function ( from, callback ) {
    fs.readdir( from, function ( err, files ) {
      if ( err ) {
        callback && callback( err )
      } else {
        var index = 0
        var filecount = files.length
        var loop = function () {
          var filename = files[index]
          var filepath = path.join( from, filename )
          fs.lstat( filepath, function ( err, stats ) {
            if ( err ) {
              callback( err )
            } else {
              if ( stats.isDirectory() ) {
                if ( that.filter( 'directory', filepath, filename ) ) {
                  filelist.dirs.push( filepath )
                  getfiles( filepath, function ( err ) {
                    checker( err )
                  } )
                } else {
                  checker()
                }
              } else if ( stats.isFile() ) {
                if ( that.filter( 'file', filepath, filename ) ) {
                  filelist.files.push( filepath )
                }
                checker()
              } else {
                checker()
              }
            }
          } )
        }
        var checker = function ( err ) {
          if ( err ) {
            callback( err )
          } else {
            index++
            if ( index === filecount ) {
              callback( null, filelist )
            } else {
              loop()
            }
          }
        }
        if ( filecount > 0 ) {
          loop()
        } else {
          callback( null, filelist )
        }
      }
    } )
  }
  getfiles( this.from, callback )
}

FileTools.prototype.mkdir = function ( list, callback ) {
  var index = 0
  var filecount = list.length
  var loop = function () {
    mkdir( list[index], function ( err ) {
      if ( err ) {
        callback( err )
      } else {
        index++
        if ( index === filecount ) {
          callback( null )
        } else {
          loop()
        }
      }
    } )
  }
  if ( list.length > 0 ) {
    loop()
  } else {
    callback( null )
  }
}

FileTools.prototype.copyfile = function ( list, callback ) {
  var that = this
  var index = 0
  var filecount = list.length
  var loop = function () {
    var filepath = list[index]
    var rs = fs.createReadStream( filepath )
    var ws = fs.createWriteStream( path.join( that.to, path.relative( that.from, filepath ) ) )
    rs.on( 'end', function () {
      index++
      if ( index === filecount ) {
        callback( null )
      } else {
        loop()
      }
    } )
    rs.pipe( ws )
  }
  if ( filecount > 0 ) {
    loop()
  } else {
    callback( null )
  }
}

function copy ( from, to, filter, callback ) {
  if ( typeof filter === 'function' && !callback ) {
    callback = filter
    filter = null
  }
  filter = filter || function () {
    return true
  }
  var tools = new FileTools( from, to, filter )
  tools.find( function ( e, list ) {
    var dirs = list.dirs.map( function ( v ) {
      return path.join( tools.to, path.relative( tools.from, v ) )
    } ).concat( [ tools.to ] )
    tools.mkdir( dirs, function () {
      tools.copyfile( list.files, callback )
    } )
  } )
}

module.exports = copy