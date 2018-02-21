#!/usr/bin/env node

// Save pwd & load modules
var co             = require('co'),
    docblockParser = require('docblock-parser'),
    fs             = require('fs-extra'),
    path           = require('path'),
    pwd            = process.cwd(),
    slash          = require('slashjs'),
    Stream         = require('stream'),
    through        = require('through2');

// Create useful scandir function
fs.scandir = co.wrap(function*( dir ) {
  var stat, filename, i, src = yield fs.readdir(dir);
  var output = [];
  for ( i in src ) {
    if (!src.hasOwnProperty(i)) continue;
    filename = path.join( dir, src[i] );
    stat     = yield fs.stat( filename );
    if ( stat.isDirectory() ) {
      output = output.concat( yield fs.scandir( filename ) );
    } else if ( stat.isFile() ) {
      output.push( filename );
    }
  }
  return output;
});

// Start of the processing stream
var processor = new Stream.Readable();
processor._read = function(noop){};

// Pre-compile regexes
var reg = {
  docblock: /\/\*{2}([\s\S]+?)\*\//g
};

// Setup the processing
processor

  // Make sure it's a javascript file
  .pipe(through.obj(function(filename, enc, cb ) {
    filename = filename.toString(enc);
    if ( filename.slice(-3).toLowerCase() === '.js' ) this.push(filename);
    cb();
  }))

  // Convert filenames into 'file objects'
  .pipe(through.obj(function( filename, enc, cb ) {
    var s = this;
    fs.readFile(filename)
      .then(function(contents) {
        s.push({
          filename: filename,
          contents: contents.toString(enc)
        });
        cb();
      })
      .catch(function(err) {
        cb(err);
      })
  }))

  // Normalize the newlines
  .pipe(through.obj(function( fileObject, enc, cb ) {
    fileObject.contents = fileObject.contents
      .replace(/\r\n/g,'\n')
      .replace(/\r/g,'\n');
    this.push(fileObject);
    cb();
  }))

  // Generate list of docblocks & pre-process them
  .pipe(through.obj(function( fileObject, enc, cb ) {
    var blocks = fileObject.contents.match(reg.docblock);
    fileObject.docblocks = [];
    if ( blocks ) {
      fileObject.docblocks = blocks.map(function(block) {
        var b = docblockParser({
          tags: { scope       : docblockParser.multilineTilTag,
                  description : docblockParser.multilineTilTag }
        }).parse(block);
        b.line = fileObject.contents.slice(0,fileObject.contents.indexOf(block)).split('\n').length;
        return b;
      });
      this.push(fileObject);
    }
    cb();
  }))

  // Skip files without interesting docblocks
  .pipe(through.obj(function( fileObject, enc, cb ) {
    fileObject.docblocks = fileObject.docblocks.filter(function(docblock) {
      return docblock.tags.scope && docblock.tags.description;
    });
    if ( fileObject.docblocks.length ) this.push(fileObject);
    cb();
  }))

  // Try to generate the entries
  .pipe(through.obj(function( fileObject, enc, cb ) {
    fileObject.docblocks.forEach(function(docblock) {
      var scope       = docblock.tags.scope,
          description = docblock.tags.description,
          title       = docblock.text.split('\n\n',2),
          text        = title.length === 2 ? title.pop() : '',
          relpath     = fileObject.filename.slice(pwd.length+1).replace(/\\/g,'/');
      title = title.shift();
      scope = scope.replace(/\[relpath\]/g,relpath);
      process.stdout.write(slash(scope)+'.'+slash(description)+'  '+title+'\n');
      process.stdout.write('  '+relpath+':'+docblock.line+'\n');
      process.stdout.write('  '+(text?'\n  ':'')+text.replace(/\n/g,'  \n')+'\n');
      process.stdout.write('\n');
    });
    cb();
  }))


// Scan for all files to process
// Push them to the processor afterwards
fs.scandir(pwd)
  .then(function(files) {
    return files.filter(function(filename) {
      return filename.indexOf('/.') === -1 ;
    });
  })
  .then(function(files) {
    files.forEach(function(filename) {
      processor.push(filename);
    })
  });
