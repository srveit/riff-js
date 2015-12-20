/**
 * @file Implements the RiffForm class.
 * @copyright Stephen R. Veit 2015
 */
'use strict';
var lodash = require('lodash'),
  Chunk = require('../riff/chunk'),
  ListChunk = require('../riff/listChunk');

/**
 * A RIFF form is a chunk with a ‘RIFF’ chunk ID. The term also refers
 * to a file format that follows the RIFF framework. It inherits from
 * ListChunk.
 * @class RiffForm
 */
/**
 * Creates a RIFF chunk that contains a list of RIFF chunks
 * @name RiffForm.createRiffForm
 * @function
 * @param {object} spec
 * @param {string} [spec.formType] - four-character code that
 * identifies the contents of the list. Defaults to "    " (four spaces).
 * @param {Chunk[]} [spec.chunks] - chunks contained in
 *   list. Defaults to [].
 * @param {Buffer} [spec.contents] - encoded byte contents of the chunk.
 * @param {number} [spec.offset] - position from start of buffer of
 *   encoded chunk.
 */
function createRiffForm(spec) {
  var that;

  spec = spec || {};
  if (spec.contents) {
    that = ListChunk.createListChunk(spec);
  } else {
    that = ListChunk.createListChunk({
      listType: spec.formType,
      id: 'RIFF',
      chunks: spec.chunks
    });
  }

  /**
   * The four character list type of chunk
   * @name RiffForm#formType
   * @readonly
   */
  Object.defineProperty(that, 'formType', {
    get: function () {
      return that.listType;
    }
  });

  return that;
}

Chunk.registerChunkConstructor('RIFF', createRiffForm);

exports.createRiffForm = createRiffForm;
