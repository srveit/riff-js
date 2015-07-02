/**
 * @file Implements the Chunk class
 * @copyright Stephen R. Veit 2015
 */
var _ = require('lodash'),
    chunkConstructors = {};

/**
 * @class Chunk
 */
/**
 * Creates a Chunk from the spec. A Chunk is the basic building block
 * of a RIFF file.
 * @function
 * @param {string} [spec.id] - A four-character code that identifies
 *   the representation of the chunk data. Defaults to " ".
 * @param {string} [spec.size] - The number of bytes in the chunk
 *   data. It does not include the ID and size. Defaults to 0.
 * @param {Buffer} [spec.data] - Binary data of the chunk. Defaults to
 *   an empty buffer.
 */
function createChunk(spec) {
  var that = {},
      specIn = spec || {},
      size = specIn.size || 0,
      /**
       * Writes a four character chunk ID to the buffer
       * @param {string} [id] - four character ID of chunk. Defaults to
       *   "    ".
       * @param {number} [offset] - byte position of first character of ID
       *   in buffer. Defaults to 0.
       */
      writeId = function(id, offset) {
        offset = offset || 0;
        if (_.isString(id)) {
          id = (id + '    ').substr(0, 4);
        } else {
          id = '    ';
        }
        that.contents.write(id, offset, 4, 'ascii');
      },
      /**
       * Writes a four byte size to the buffer
       * @param {number} [size] - the size of the chunk not including the
       *   chunk ID and size. Defaults to 0.
       * @param {number} [offset] - byte position of first byte of size in
       *   buffer. Defaults to 0.
       */
      writeSize = function(size, offset) {
        size = size || 0;
        offset = offset || 0;
        that.contents.writeUInt32BE(size, offset);
      },
      /**
       * Sets ths encoded contents of a chunk.
       * @param {Buffer} contents - encoded byte contents of the chunk
       */
      setContents = function (newContents) {
        that.contents = newContents;
      };

  /**
   * The number of bytes in the encoded representation of the chunk
   * @property {number}
   * @name Chunk#bufferLength
   * @readonly
   */
  Object.defineProperty(that, 'bufferLength', {
    get: function () {
      return that.contents.length;
    }
  });
  /**
   * The four character ID of chunk
   * @property {string}
   * @name Chunk#id
   * @readonly
   */
  Object.defineProperty(that, 'id', {
    get: function () {
      if (Buffer.isBuffer(that.contents)) {
        return that.contents.toString('ascii', 0, 4);
      } else {
        return undefined;
      }
    }
  });
  /**
   * the size of the chunk not including the chunk id and size.
   * @property {number}
   * @name Chunk#size
   * @readonly
   */
  Object.defineProperty(that, 'size', {
    get: function () {
      if (Buffer.isBuffer(that.contents)) {
        return that.contents.readUInt32BE(4);
      } else {
        return undefined;
      }
    }
  });

  that.writeId = writeId;
  that.writeSize = writeSize;
  that.setContents = setContents;
  that.contents = new Buffer(8 + size);
  writeId(specIn.id);
  writeSize(size, 4);
  return that;
}

/**
 * Returns the contructor class to be used for decoding a chunk
 * @param {string} id - 4-character RIFF chunk ID
 * @returns {function} - constructor for decoding the RIFF chunk
 */
function chunkConstructor(id) {
  return chunkConstructors[id] || createChunk;
};

/**
 * Registers the class to be used for decoding a chunk
 * @param {string} id - 4-character RIFF chunk ID
 * @returns {function} chunkConstructor - constructor for decoding the RIFF chunk
 */
function registerChunkConstructor(id, chunkConstructor) {
  chunkConstructors[id] = chunkConstructor;
};

/**
 * Creates a chunk of the appropriate class from the contents of a chunk
 * @param {Buffer} contents - encoded byte contents of the chunk
 * @returns {object} - chunk of the appropriate class
 */
function createChunkFromBuffer(contents) {
  var id, constructor, chunk;
  if (Buffer.isBuffer(contents)) {
    id = contents.toString('ascii', 0, 4);
    constructor = chunkConstructor(id);
    chunk = constructor();
    chunk.setContents(contents);
    return chunk;
  } else {
    return createChunk(contents);
  }
};

exports.createChunk = createChunk;
exports.createChunkFromBuffer = createChunkFromBuffer;
exports.registerChunkConstructor = registerChunkConstructor;
exports.chunkConstructor = chunkConstructor;
