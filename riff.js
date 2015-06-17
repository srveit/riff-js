var BaseChunk = require('./riff/baseChunk');

function Riff() {
}

function decodeRiff(fileContents) {
  return new Riff(fileContents);
}

module.exports = {
  BaseChunk: BaseChunk,
  decodeRiff: decodeRiff
};

