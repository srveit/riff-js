/**
 * @file Implements the ListChunk class.
 * @copyright Stephen R. Veit 2015
 */
'use strict';
var lodash = require('lodash'),
  Chunk = require('../riff/chunk');

/**
 * A LIST chunk contains a list, or ordered sequence, of subchunks.
 * @class ListChunk
 */
/**
 * Creates a RIFF chunk that contains a list of RIFF chunks
 * @name ListChunk.createListChunk
 * @function
 * @param {object} spec
 * @param {string} [spec.listType] - four-character code that
 * identifies the contents of the list. Defaults to "    " (four spaces).
 * @param {string} [spec.id] - four character ID of chunk. Defaults to
 *   "LIST".
 * @param {Chunk[]} [spec.chunks] - chunks contained in
 *   list. Defaults to [].
 * @param {Buffer} [spec.contents] - encoded byte contents of the chunk.
 * @param {number} [spec.offset] - position from start of buffer of
 *   encoded chunk.
 */
function createListChunk(spec) {
  var id, chunks, listType, data, that,
    /**
     * Returns the last chunk with the given ID
     * @name ListChunk#chunkWithId
     * @function
     * @param {string} id - ID of RIFF chunk
     * @returns {Chunk} chunk with the given ID or undefined
     */
    chunkWithId = function (id) {
      return lodash.find(chunks, {id: id});
    },
    /**
     * Adds a chunk to the end of the list of chunks
     * @name ListChunk#add
     * @function
     * @param {Chunk} chunk to add
     */
    add = function (chunk) {
      chunks.push(chunk);
      that.appendData(chunk.contents);
    },
    /**
     * Decodes consective chunks from the chunk contents starting at offset.
     * @name ListChunk#decodeChunks
     * @function
     * @private
     * @param {Chunk} chunk - list chunk containing the encoded chunks
     * @param {number} offset - number of bytes from start of the chunk
     * @returns {Chunk[]} list of decoded chunks
     */
    decodeChunks = function (chunk, offset) {
      var subChunk;
      if (offset >= chunk.bufferLength) {
        return [];
      }
      subChunk = Chunk.createChunkFromBuffer({contents: chunk.contents,
                                              offset: offset});
      return [subChunk].concat(decodeChunks(chunk,
                                            offset + subChunk.bufferLength));
    },
    /**
     * Returns the data description of the chunk indented by the given
     *   number of spaces if it flows to another line
     * @name Chunk#dataDescription
     * @function
     * @param {number} [indent] - number of spaces to put in front of
     *   each line of the desription after the first line. Defaults to 0.
     * @returns {string} description of chunk
     */
    dataDescription = function (indent) {
      var description = '\'' + that.listType + '\'';
      if (chunks.length > 0) {
        description += '  ' + chunks.map(function (chunk) {
          return chunk.description(indent + 8);
        }).join('\n' + that.spaces(indent + 8));
      }
      return description;
    };

  spec = spec || {};
  if (spec.contents) {
    that = Chunk.createChunk(spec);
    chunks = decodeChunks(that, 12);
  } else {
    id = (spec && spec.id) || 'LIST';
    chunks = (spec && spec.chunks) || [];
    listType = (spec && spec.listType) || '    ';
    data = [new Buffer(listType, 'ascii')]
      .concat(chunks.map(function (chunk) {return chunk.contents; }));
    that = Chunk.createChunk({id: id, data: data});
  }

  /**
   * The list of chunks
   * @name ListChunk#chunks
   * @readonly
   */
  Object.defineProperty(that, "chunks", {
    get: function () {
      return chunks;
    }
  });
  /**
   * The number of chunks in the list
   * @name ListChunk#length
   * @readonly
   */
  Object.defineProperty(that, "length", {
    get: function () {
      return chunks.length;
    }
  });
  /**
   * The four character list type of chunk
   * @name ListChunk#listType
   * @readonly
   */
  Object.defineProperty(that, 'listType', {
    get: function () {
      return that.decodeString(8, 12);
    }
  });

  that.chunkWithId = chunkWithId;
  that.add = add;
  that.dataDescription = dataDescription;

  return that;
}

Chunk.registerChunkConstructor('LIST', createListChunk);

exports.createListChunk = createListChunk;
