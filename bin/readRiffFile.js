'use strict';
var fs = require('fs'),
  Chunk = require('../riff/chunk'),
  RiffForm = require('../riff/riffForm');
require('../riff/factChunk');
require('../riff/zstrChunk');

function readRiffFile() {
  var filename = process.argv[2],
      buffer = fs.readFileSync(filename),
      chunk;
  console.log(filename, buffer.length);
  chunk = Chunk.createChunkFromBuffer({contents: buffer});
  if (chunk) {
    console.log(chunk.description());
  } else {
    console.log('unable to parse', buffer);
  }
}

readRiffFile();

