var fs = require( 'fs' )
var path = require( 'path' )

var mkdir = function ( dist ) {
  dist = path.resolve( dist )
  if ( !fs.existsSync( dist ) ) {
    mkdir( path.dirname( dist ) )
    fs.mkdirSync( dist )
  }
}

function FileTools ( from, to, filter ) {
  this.from = from
  this.to = to
  this.filter = filter
  return this
}

FileTools.prototype.find = function () {
  var that = this
  var filelist = {
    dirs: [],
    files: []
  }
  var getfiles = function ( from ) {
    var files = fs.readdirSync( from )
    var index = 0
    var filecount = files.length
    var loop = function () {
      var filename = files[index]
      var filepath = path.join( from, filename )
      var stats = fs.lstatSync( filepath )
      if ( stats.isDirectory() ) {
        if ( that.filter( 'directory', filepath, filename ) ) {
          filelist.dirs.push( filepath )
          getfiles( filepath )
        }
      } else if ( stats.isFile() ) {
        if ( that.filter( 'file', filepath, filename ) ) {
          filelist.files.push( filepath )
        }
      }
      return checker()
    }
    var checker = function () {
      index++
      if ( index === filecount ) {
        return filelist
      } else {
        return loop()
      }
    }
    if ( filecount > 0 ) {
      return loop()
    } else {
      return filelist
    }
  }
  return getfiles( this.from )
}

FileTools.prototype.mkdir = function ( list ) {
  var index = 0
  var filecount = list.length
  var loop = function () {
    mkdir( list[index] )
    index++
    if ( index === filecount ) {
      return true
    } else {
      return loop()
    }
  }
  if ( filecount > 0 ) {
    return loop()
  } else {
    return true
  }
}

FileTools.prototype.copyfile = function ( list ) {
  var that = this
  var index = 0
  var filecount = list.length
  var loop = function () {
    var filepath = list[index]
    var distpath = path.join( that.to, path.relative( that.from, filepath ) )
    fs.writeFileSync( distpath, fs.readFileSync( filepath, 'binary' ), 'binary' )
    index++
    if ( index === filecount ) {
      return true
    } else {
      return loop()
    }
  }
  if ( filecount > 0 ) {
    return loop()
  } else {
    return true
  }
}

module.exports = function ( from, to, filter ) {
  filter = filter || function () {
    return true
  }
  var tools = new FileTools( from, to, filter )
  var list = tools.find()
  var dirs = list.dirs.map( function ( v ) {
    return path.join( tools.to, path.relative( tools.from, v ) )
  } )
  tools.mkdir( dirs )
  tools.copyfile( list.files )
}
