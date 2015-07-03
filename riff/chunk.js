/**
 * @file Implements the Chunk class
 * @copyright Stephen R. Veit 2015
 */
'use strict';
var chunkConstructors = {};

/**
 * The basic building block of a RIFF file.
 * @class Chunk
 */
/**
 * Creates a Chunk from the spec. A Chunk is the basic building block
 * of a RIFF file.
 * @name Chunk.createChunk
 * @function
 * @param {string} [spec.id] - four-character code that identifies
 *   the representation of the chunk data. Defaults to " ".
 * @param {Buffer} [spec.data] - binary data of the chunk. Defaults to
 *   an empty buffer.
 * @param {Buffer} [spec.contents] - encoded byte contents of the chunk
 * @param {number} [spec.offset] - position from start of buffer of encoded chunk
 * @returns {Chunk} created chunk
 */
function createChunk(spec) {
  var that = {},
    size,
    length,
    offset,
    data,
    /**
     * Writes a four character chunk ID to the buffer
     * @name Chunk#writeId
     * @function
     * @param {string} [id] - four character ID of chunk. Defaults to
     *   "    " (four spaces).
     * @param {number} [offset] - byte position of first character of ID
     *   in buffer. Defaults to 0.
     */
    writeId = function (id, offset) {
      offset = offset || 0;
      if (id) {
        id = (id + '    ').substr(0, 4);
      } else {
        id = '    ';
      }
      that.contents.write(id, offset, 4, 'ascii');
    },
    /**
     * Writes a four byte size to the buffer
     * @name Chunk#writeSize
     * @function
     * @param {number} [size] - the size of the chunk not including the
     *   chunk ID and size. Defaults to 0.
     * @param {number} [offset] - byte position of first byte of size in
     *   buffer. Defaults to 0.
     */
    writeSize = function (size, offset) {
      size = size || 0;
      offset = offset || 0;
      that.contents.writeUInt32BE(size, offset);
    },
    /**
     * Appends data to the chunk. The size of the chunk is increase
     * by the size of data or size of data + 1, if a pad byte had
     * been previously added.
     * @name Chunk#appendData
     * @function
     * @param {Buffer} data - a Buffer or array of buffers.
     */
    appendData = function (data) {
      var newSize;
      data = Array.isArray(data) ? data : [data];
      that.contents = Buffer.concat([that.contents].concat(data));
      newSize = that.contents.length - 8 + (that.size % 2);
      writeSize(newSize, 4);
    },
    /**
     * Decodes an ASCII string from the chunk at the given position
     * @name Chunk#decodeString
     * @function
     * @param {number} start - first position of the start of the string
     * @param {number} [end] - position after the end of the
     * string. Defaults to the end of the chunk.
     * @returns {string} decoded string
     */
    decodeString = function (start, end) {
      if (Buffer.isBuffer(that.contents)) {
        return that.contents.toString('ascii', start, end);
      }
      return '';
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
      return that.decodeString(0, 4);
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
      }
    }
  });

  spec = spec || {};
  if (spec.contents) {
    offset = spec.offset || 0;
    size = spec.contents.readUInt32BE(offset + 4);
    length = size + 8 + (size % 2); // make sure length is even
    that.contents = spec.contents.slice(offset, offset + length);
  } else {
    data = spec.data ?
        (Array.isArray(spec.data) ? spec.data : [spec.data]) : [];
    that.contents = Buffer.concat([new Buffer(8)].concat(data));
    writeId(spec.id);
    size = that.contents.length - 8;
    length = size + 8 + (size % 2); // make sure length is even
    writeSize(size, 4);
  }
  if (that.contents.length < length) {
    // Pad contents
    that.contents = Buffer.concat([that.contents].concat(new Buffer([0])));
  }

  that.writeId = writeId;
  that.writeSize = writeSize;
  that.appendData = appendData;
  that.decodeString = decodeString;

  return that;
}

/**
 * Returns the contructor class to be used for decoding a chunk
 * @name Chunk.chunkConstructor
 * @function
 * @private
 * @param {string} id - 4-character RIFF chunk ID
 * @returns {function} constructor for decoding the RIFF chunk
 */
function chunkConstructor(id) {
  return chunkConstructors[id] || createChunk;
}

/**
 * Registers the constructor to be used for decoding a chunk
 * @name Chunk.registerChunkConstructor
 * @function
 * @param {string} id - 4-character RIFF chunk ID
 * @returns {function} chunkConstructor - constructor for decoding the
 * RIFF chunk
 */
function registerChunkConstructor(id, chunkConstructor) {
  chunkConstructors[id] = chunkConstructor;
}

/**
 * Creates a chunk of the appropriate class from the contents of a chunk
 * @name Chunk.createChunkFromBuffer
 * @function
 * @param {Buffer} args.contents - encoded byte contents of the chunk
 * @param {number} [args.offset] - position from start of buffer of
 *   encoded chunk
 * @returns {Chunk} - chunk of the appropriate class
 */
function createChunkFromBuffer(args) {
  var id, offset = args.offset || 0;
  id = args.contents.toString('ascii', offset, offset + 4);
  return chunkConstructor(id)(args);
}

exports.createChunk = createChunk;
exports.createChunkFromBuffer = createChunkFromBuffer;
exports.registerChunkConstructor = registerChunkConstructor;
