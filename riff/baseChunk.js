/**
 * @file Implements the BaseChunk class
 * @copyright Stephen R. Veit 2015
 */
var _ = require('lodash'),
    chunkClasses = {};

/**
 * The basic data structure in a RIFF file.
 * @class
 * @param {string} [id] - four character ID of chunk. Defaults to "    "
 * @param {string} [size] - number of bytes in the chunk not
 *   including the ID and size. Defaults to 0
 */
function BaseChunk(id, size, data) {
  size = size || 0;
  this.contents = new Buffer(8 + size);
  this.writeId(id);
  this.writeSize(size, 4);
}

/**
 * Writes a four character chunk ID to the buffer
 * @param {string} [id] - four character ID of chunk. Defaults to
 *   "    ".
 * @param {number} [offset] - byte position of first character of ID
 *   in buffer. Defaults to 0.
 */
BaseChunk.prototype.writeId = function(id, offset) {
  offset = offset || 0;
  if (_.isString(id)) {
    id = (id + '    ').substr(0, 4);
  } else {
    id = '    ';
  }
  this.contents.write(id, offset, 4, 'ascii');
};

/**
 * Writes a four byte size to the buffer
 * @param {number} [size] - the size of the chunk not including the
 *   chunk ID and size. Defaults to 0.
 * @param {number} [offset] - byte position of first byte of size in
 *   buffer. Defaults to 0.
 */
BaseChunk.prototype.writeSize = function(size, offset) {
  size = size || 0;
  offset = offset || 0;
  this.contents.writeUInt32BE(size, offset);
};

/**
 * Sets ths encoded contents of a chunk.
 * @param {Buffer} contents - encoded byte contents of the chunk
 */
BaseChunk.prototype.setContents = function (contents) {
  this.contents = contents;
};

/**
 * The number of bytes in the encoded representation of the chunk
 * @property {number}
 * @name BaseChunk#bufferLength
 * @readonly
 */
Object.defineProperty(BaseChunk.prototype, 'bufferLength', {
  get: function () {
    return this.contents.length;
  }
});

/**
 * The four character ID of chunk
 * @property {string}
 * @name BaseChunk#id
 * @readonly
 */
Object.defineProperty(BaseChunk.prototype, 'id', {
  get: function () {
    if (Buffer.isBuffer(this.contents)) {
      return this.contents.toString('ascii', 0, 4);
    } else {
      return undefined;
    }
  }
});

/**
 * the size of the chunk not including the chunk id and size.
 * @property {number}
 * @name BaseChunk#size
 * @readonly
 */
Object.defineProperty(BaseChunk.prototype, 'size', {
  get: function () {
    if (Buffer.isBuffer(this.contents)) {
      return this.contents.readUInt32BE(4);
    } else {
      return undefined;
    }
  }
});

/**
 * Returns the class to be used for decoding a chunk
 * @param {string} id - 4-character RIFF chunk ID
 * @returns {function} - constructor for decoding the RIFF chunk
 */
BaseChunk.chunkClass = function (id) {
  return chunkClasses[id] || BaseChunk;
};

/**
 * Creates a chunk of the appropriate class from the contents of a chunk
 * @param {Buffer} contents - encoded byte contents of the chunk
 * @returns {object} - chunk of the appropriate class
 */
BaseChunk.createChunk = function (contents) {
  var id = contents.toString('ascii', 0, 4),
      chunkClass = this.chunkClass(id),
      chunk = new chunkClass();
  chunk.setContents(contents);
  return chunk;
};

/**
 * Registers the class to be used for decoding a chunk
 * @param {string} id - 4-character RIFF chunk ID
 * @returns {function} chunkClass - constructor for decoding the RIFF chunk
 */
BaseChunk.registerChunkClass = function (id, chunkClass) {
  chunkClasses[id] = chunkClass;
};
module.exports = BaseChunk;
