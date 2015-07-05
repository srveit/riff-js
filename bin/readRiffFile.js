'use strict';
var fs = require('fs'),
  riff = require('../riff');

function readRiffFile(filename) {
  fs.readFile(filename, function (err, buffer) {
    var chunk;
    if (err) {
      throw err;
    }
    console.log(filename, buffer.length);
    chunk = riff.createChunkFromBuffer({contents: buffer});
    console.log(chunk.description());
  });
}

readRiffFile(process.argv[2]);
