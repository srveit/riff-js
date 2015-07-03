/**
 * @file Implements the Chunk class
 * @copyright Stephen R. Veit 2015
 */
'use strict';
var chunkConstructors = {},
  spacesBuffer = new Buffer(1000);

spacesBuffer.fill(' ');

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
    contents,
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
      contents.write(id, offset, 4, 'ascii');
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
      contents.writeUInt32BE(size, offset);
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
      contents = Buffer.concat([contents].concat(data));
      newSize = contents.length - 8 + (that.size % 2);
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
      if (Buffer.isBuffer(contents)) {
        return contents.toString('ascii', start, end);
      }
      return '';
    },
    /**
     * Returns a string with a given number of spaces
     * @name Chunk#spaces
     * @function
     * @param {number} length - number of spaces
     * @returns {string} string of spaces
     */
    spaces = function (length) {
      return spacesBuffer.toString('ascii', 0, length);
    },
    /**
     * Returns the data description of the chunk indented by the given
     *   number of spaces if it flows to another line
     * @name Chunk#dataDescription
     * @function
     * @param {number} indent - number of spaces to put in front of
     *   each line of the desription after the first line.
     * @returns {string} description of chunk
     */
    dataDescription = function () {
      return '';
    },
    /**
     * Returns the description of the chunk indented by the given
     *   number of spaces
     * @name Chunk#description
     * @function
     * @param {number} [indent] - number of spaces to put in front of
     *   each line of the desription except the first. Defaults to 0.
     * @returns {string} description of chunk
     */
    description = function (indent) {
      indent = indent || 0;
      return that.id +
        '(' + that.dataDescription(indent + 5) + ')';
    };

  /**
   * The number of bytes in the encoded representation of the chunk
   * @name Chunk#bufferLength
   * @readonly
   */
  Object.defineProperty(that, 'bufferLength', {
    get: function () {
      return contents.length;
    }
  });
  /**
   * The four character ID of chunk
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
   * @name Chunk#size
   * @readonly
   */
  Object.defineProperty(that, 'size', {
    get: function () {
      if (Buffer.isBuffer(contents)) {
        return contents.readUInt32BE(4);
      }
    }
  });
  /**
   * The encoded byte buffer fo the chunk
   * @name Chunk#contents
   * @readonly
   */
  Object.defineProperty(that, 'contents', {
    get: function () {
      return contents;
    }
  });

  spec = spec || {};
  if (spec.contents) {
    offset = spec.offset || 0;
    size = spec.contents.readUInt32BE(offset + 4);
    length = size + 8 + (size % 2); // make sure length is even
    contents = spec.contents.slice(offset, offset + length);
  } else {
    data = spec.data ?
        (Array.isArray(spec.data) ? spec.data : [spec.data]) : [];
    contents = Buffer.concat([new Buffer(8)].concat(data));
    writeId(spec.id);
    size = contents.length - 8;
    length = size + 8 + (size % 2); // make sure length is even
    writeSize(size, 4);
  }
  if (contents.length < length) {
    // Pad contents
    contents = Buffer.concat([contents].concat(new Buffer([0])));
  }

  that.writeId = writeId;
  that.writeSize = writeSize;
  that.appendData = appendData;
  that.decodeString = decodeString;
  that.dataDescription = dataDescription;
  that.description = description;
  that.spaces = spaces;

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
