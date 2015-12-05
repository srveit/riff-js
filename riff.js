/**
 * @file Implements decoding and encoding RIFF format files.
 * @copyright Stephen R. Veit 2015
 */
'use strict';
var Chunk = require('./riff/chunk'),
  audioConverter = require('./riff/audioConverter');
require('./riff/riffForm');
require('./riff/factChunk');
require('./riff/zstrChunk');
require('./riff/fmtChunk');
/**
 * @namespace riff
 */
/**
 * Creates a chunk of the appropriate class from the contents of a chunk
 * @name riff.createChunkFromBuffer
 * @function
 * @memberof riff
 * @param {object} args
 * @param {Buffer} args.contents - encoded byte contents of the chunk
 * @param {number} [args.offset] - position from start of buffer of
 *   encoded chunk
 * @returns {Chunk} - chunk of the appropriate class
 */
/**
 * Creates a chunk of the given id, use the given paramters
 * @name riff.createChunkWithId
 * @function
 * @memberof riff
 * @param {object} spec - named parameters for constructing chunk of
 *   type spec.id
 * @param {string} spec.id - four-character code that identifies
 * @returns {Chunk} - chunk of the appropriate class
 */
function convertToUlaw(buffer) {
  var pcmFile = Chunk.createChunkFromBuffer({contents: buffer}),
    ulawFile = audioConverter.toUlaw(pcmFile);
  return ulawFile.contents;
}
exports.createChunkFromBuffer = Chunk.createChunkFromBuffer;
exports.createChunkWithId = Chunk.createChunkWithId;
exports.convertToUlaw = convertToUlaw;
