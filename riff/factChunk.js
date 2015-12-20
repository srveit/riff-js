/**
 * @file Implements the FactChunk class.
 * @copyright Stephen R. Veit 2015
 */
'use strict';
var lodash = require('lodash'),
  Chunk = require('../riff/chunk');

/**
 * A fact chunk stores important information about the contents of the
 * WAVE file. It stores the number of samples in the file.
 * @class FactChunk
 */
/**
 * Creates a fact chunk that contains the number of samples in a WAVE file.
 * @name FactChunk.createFactChunk
 * @function
 * @param {object} spec
 * @param {number} [spec.fileSize] - number of samples. Defaults to 0.
 * @param {Buffer} [spec.contents] - encoded byte contents of the chunk.
 * @param {number} [spec.offset] - position from start of buffer of
 *   encoded chunk.
 */
function createFactChunk(spec) {
  var fileSize, data, that,
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
      return String(that.fileSize);
    };

  spec = spec || {};
  if (spec.contents) {
    that = Chunk.createChunk(spec);
  } else {
    fileSize = (spec && spec.fileSize) || 0;
    data = new Buffer(4);
    data.writeUInt32LE(fileSize, 0);
    that = Chunk.createChunk({id: 'fact', data: data});
  }

  /**
   * The number of samples in the WAVE file.
   * @name FactChunk#fileSize
   */
  Object.defineProperty(that, "fileSize", {
    get: function () {
      return that.data.readUInt32LE(0);
    }
  });

  that.dataDescription = dataDescription;

  return that;
}

Chunk.registerChunkConstructor('fact', createFactChunk);

exports.createFactChunk = createFactChunk;
