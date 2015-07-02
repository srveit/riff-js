var Chunk = require('./riff/chunk');

function Riff() {
}

function decodeRiff(fileContents) {
  return new Riff(fileContents);
}

module.exports = {
  Chunk: Chunk,
  decodeRiff: decodeRiff
};

