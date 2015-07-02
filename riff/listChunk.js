/**
 * @file Implements the ListChunk class
 * @copyright Stephen R. Veit 2015
 */
var _ = require('lodash'),
    Chunk = require('../riff/chunk');

/**
 * Creates a RIFF chunk that contains a list of RIFF chunks
 * @class
 * @property {Chunk[]} spec.chunks - chunks contained in list
 * @property {string} listType - four character type of list
 * @param {Chunk[]} spec.chunks - chunks contained in
 *   list. Defaults to []
 * @param {string} spec.listType - four character type of
 *   list. Defaults to " "
 * @param {string} spec.id - four character ID of chunk. Defaults to
 *   "LIST"
 * 
 */
function createListChunk(spec) {
  var id = spec && spec.id || 'LIST',
      chunks = spec && spec.chunks || [],
      that = Chunk.createChunk({id: id, size: 4}),
      /**
       * Returns the last chunk of the given ID
       * @name chunkById
       * @param {string} id - ID of RIFF chunk
       * @returns {Chunk} - chunk with the given ID or undefined
       */
      chunkById = function (id) {
        return _.find(that.chunks, {id: id});
      },
      /**
       * Adds a chunk to the end of the list of chunks
       * @name add
       * @returns {Chunk} - chunk to add
       */
      add = function (chunk) {
        that.chunks.push(chunk);
      };

  /**
   * The four character list type of chunk
   * @property {string}
   * @name ListChunk#listType
   * @readonly
   */
  Object.defineProperty(that, 'listType', {
    get: function () {
      if (Buffer.isBuffer(that.contents)) {
        return that.contents.toString('ascii', 8, 12);
      } else {
        return undefined;
      }
    }
  });
  /**
   * Returns the number of chunks in the list
   * @name length
   * @returns {number} - number of chunks in list
   */
  Object.defineProperty(that, "length", {
    get: function() {
      return that.chunks.length;
    }
  });

  that.chunks = chunks;
  that.chunkById = chunkById;
  that.add = add;

  that.writeId(spec && spec.listType, 8);
  that.contents = Buffer.concat([that.contents]
                                .concat(_.map(that.chunks, 'contents')));
  that.writeSize(that.bufferLength - 8, 4);
  
  return that;
}

exports.createListChunk = createListChunk;
