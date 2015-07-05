'use strict';
var fs = require('fs'),
  riff = require('../riff');

function readRiffFile(filename) {
  var buffer = fs.readFileSync(filename),
      chunk;
  console.log(filename, buffer.length);
  chunk = riff.createChunkFromBuffer({contents: buffer});
  console.log(chunk.description());
}

readRiffFile(process.argv[2]);
