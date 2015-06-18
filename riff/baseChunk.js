var _ = require('lodash'),
    chunkClasses = {};

/**
 * The basic data structure in a RIFF file.
 * @constructor
 * @param {string} type - four character type of chunk. Defaults to "    "
 * @param {string} size - number of bytes in the chunk not
 *   including the chunkType. Defaults to 0
 */
function BaseChunk(type, size) {
  if (_.isUndefined(type)) {
    type = '    ';
  }
  if (_.isUndefined(size)) {
    size = 0;
  }
  var contents = new Buffer(8);
  contents.write(type, 0, 4, 'ascii');
  contents.writeUInt32BE(size, 4);
  this.setContents(contents);
}

/**
 * Sets ths encoded contents of a RIFF file.
 * @name setContents
 * @param {Buffer} contents - encoded byte contents of the RIFF file
 */
BaseChunk.prototype.setContents = function (contents) {
  this.contents = contents;
  this.bufferLength = this.contents.length;
  this.type = this.contents.toString('ascii', 0, 4);
  this.size = this.contents.readUInt32BE(4);
};

/**
 * Returns the class to be used for decoding a chunk
 * @name chunkClass
 * @param {string} chunkType - 4-character RIFF chunk type
 * @returns {function} - constructor for decoding the RIFF chunk
 */
BaseChunk.chunkClass = function (chunkType) {
  return chunkClasses[chunkType] || BaseChunk;
};

/**
 * Creates a chunk of the appropriate class from the contents of a RIFF file
 * @name createChunk
 * @param {Buffer} contents - encoded byte contents of the RIFF file
 * @returns {object} - chunk of the appropriate class
 */
BaseChunk.createChunk = function (contents) {
  var chunkType = contents.toString('ascii', 0, 4),
      chunkClass = this.chunkClass(chunkType),
      chunk = new chunkClass();
  chunk.setContents(contents);
  return chunk;
};

/**
 * Registers the class to be used for decoding a chunk
 * @name registerChunkClass
 * @param {string} chunkType - 4-character RIFF chunk type
 * @returns {function} chunkClass - constructor for decoding the RIFF chunk
 */
BaseChunk.registerChunkClass = function (chunkType, chunkClass) {
  chunkClasses[chunkType] = chunkClass;
};
module.exports = BaseChunk;
