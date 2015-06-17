var _ = require('lodash'),
    chunkClasses = {};

/**
 * The basic data structure in a RIFF file.
 * @constructor
 * @param {string} type - four character type of chunk.
 * @param {string} size - number of bytes in the chunk not
 *   including the chunkType.
 */
function ListChunk() {
}
module.exports = ListChunk;
