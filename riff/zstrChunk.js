/**
 * @file Implements the ZstrChunk class
 * @copyright Stephen R. Veit 2015
 */
'use strict';
var lodash = require('lodash'),
  Chunk = require('../riff/chunk'),
  infoChunks = ['IARL', 'IART', 'ICMS', 'ICMT', 'ICOP', 'ICRD', 'ICRP', 'IDIM',
                'IDPI', 'IENG', 'IGNR', 'IKEY', 'ILGT', 'IMED', 'INAM', 'IPLT',
                'IPRD', 'ISBJ', 'ISFT', 'ISHP', 'ISRC', 'ISRF', 'ITCH'];

/**
 * A zstr chunk stores a ZSTR, or null-terminated text string. The
 *   following chunks are ZSTR chunks: IARL IART ICMS ICMT ICOP ICRD
 *   ICRP IDIM IDPI IENG IGNR IKEY ILGT IMED INAM IPLT IPRD ISBJ ISFT
 *   ISHP ISRC ISRF ITCH
 * @class ZstrChunk
 */
/**
 * Creates a zstr chunk that contains a null-terminated text string.
 * @name ZstrChunk.createZstrChunk
 * @function
 * @param {string} [spec.id] - four character ID of chunk. Defaults to
 *   "zstr".
 * @param {number} [spec.text] - null-terminated text string. Defaults to "".
 * @param {Buffer} [spec.contents] - encoded byte contents of the chunk.
 * @param {number} [spec.offset] - position from start of buffer of
 *   encoded chunk.
 */
function createZstrChunk(spec) {
  var id, text, data, that,
    /**
     * Returns the data description of the chunk indented by the given
     *   number of spaces if it flows to another line.
     * @name Chunk#dataDescription
     * @function
     * @param {number} [indent] - number of spaces to put in front of
     *   each line of the desription after the first line. Defaults to 0.
     * @returns {string} description of chunk
     */
    dataDescription = function () {
      return '"' + that.text + '"Z';
    };

  spec = spec || {};
  if (spec.contents) {
    that = Chunk.createChunk(spec);
  } else {
    id = (spec && spec.id) || 'zstr';
    text = (spec && lodash.isString(spec.text)) ? spec.text : '';
    data = new Buffer(text.length + 1);
    data.write(text, 0, text.length, 'ascii');
    data.writeUInt8(0, text.length);
    that = Chunk.createChunk({id: id, data: data});
  }

  /**
   * The null-terminated text string.
   * @name ZstrChunk#text
   * @readonly
   */
  Object.defineProperty(that, "text", {
    get: function () {
      return that.data.toString('ascii', 0, Math.max(0, that.size - 1));
    }
  });

  that.dataDescription = dataDescription;

  return that;
}

lodash.forEach(infoChunks, function (id) {
  Chunk.registerChunkConstructor(id, createZstrChunk);
});

exports.createZstrChunk = createZstrChunk;
