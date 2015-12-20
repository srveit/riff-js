'use strict';
var riff = require('../riff');

function parseRiffFile(filename) {
  riff.parseRiffFile(filename, function (err, parsedFile) {
    if (err) {
      throw err;
    }
    console.log(parsedFile.description());
  });
}

parseRiffFile(process.argv[2]);
