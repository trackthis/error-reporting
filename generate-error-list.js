#!/usr/bin/env node

// // Save pwd & load modules
var co             = require('co'),
    docblockParser = require('docblock-parser'),
    fs             = require('fs-extra'),
    path           = require('path'),
    pwd            = process.cwd(),
    Stream         = require('stream'),
    through        = require('through2');

// Start of the processing stream
var processor = new Stream.Readable();
processor._read = function(noop){};

// Pre-compile regexes
var reg = {
  docblock: /\/\*{2}([\s\S]+?)\*\//g
};

// Setup the processing
processor

  // Convert buffer to string
  .pipe(through.obj(function( filename, enc, cb ) {
    this.push(filename.toString(enc));
    cb();
  }))

  // Make sure it's a javascript file
  .pipe(through.obj(function(filename, enc, cb ) {
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
      });
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
      return docblock.tags.scope;
    });
    if ( fileObject.docblocks.length ) this.push(fileObject);
    cb();
  }))

  // Try to generate the entries
  .pipe(through.obj(function( fileObject, enc, cb ) {
    fileObject.docblocks.forEach(function(docblock) {
      var scope       = docblock.tags.scope,
          parts       = docblock.text.split("\n\n"),
          title       = parts.shift(),
          description = parts.join("\n\n"),
          relpath     = fileObject.filename.slice(pwd.length+1).replace(/\\/g,'/');
      scope = scope.replace(/\[relpath\]/g,relpath);

      process.stdout.write(relpath+":"+docblock.line+" -- ["+(docblock.tags.level?(docblock.tags.level.toUpperCase()+':'):'')+scope+"] "+title+"  "+"\n");
      process.stdout.write("   "+description.split("\n").join("\n   ")+"\n");
      process.stdout.write('\n');
    });
    cb();
  }));

// Recursive push files to the processor
var toProcess = fs.readdirSync(pwd).map((rp)=>pwd+path.sep+rp);
(function next() {
  var absolutePath = toProcess.shift();                      // Fetch the first to process
  if(!absolutePath) return;                                  // false-ish = done
  var parts = absolutePath.split(path.sep);                  // Split the path
  if(parts[parts.length-1].substr(0,1)==='.') return next(); // To check for a dotfile here

  // Stat the path
  fs.stat(absolutePath, function(err, stat) {
    if(err) return next();
    if(!stat) return next();

    if( stat.isDirectory() ) {
      // Directories need to be scanned
      fs.readdirSync(absolutePath).forEach(function(entry) {
        toProcess.push(parts.concat([entry]).join(path.sep));
      });
      return next();
    } else if ( stat.isFile() ) {
      // Files are send to the processor
      processor.push(absolutePath);
      return next();
    }
  });
})();
