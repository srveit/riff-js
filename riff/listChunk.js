var _ = require('lodash'),
    util = require('util'),
    BaseChunk = require('../riff/baseChunk'),
    chunkClasses = {};

/**
 * Creates a RIFF chunk that contains a list of RIFF chunks
 * @class
 * @property {BaseChunk[]} chunks - chunks contained in list
 * @property {string} listType - four character type of list
 * @param {BaseChunk[]} chunks - chunks contained in list. Defaults to []
 * @param {string} listType - four character type of list. Defaults to "    "
 * @param {string} chunkType - four character type of chunk. Defaults to "LIST"
 * 
 */
function ListChunk(chunks, listType, chunkType) {
  var size;
  if (_.isUndefined(chunks)) {
    chunks = [];
  }
  this.chunks = chunks;
  if (!listType) {
    listType = '    ';
  }
  this.listType = listType;
  if (!chunkType) {
    chunkType = 'LIST';
  }
  size = _chunkSize(this);
  BaseChunk.call(this, chunkType, size);
}

util.inherits(ListChunk, BaseChunk);

function _chunkSize(listChunk) {
  return _.reduce(listChunk.chunks, function (sum, chunk) {
    return sum + (chunk.bufferLength || 0);
  }, 4);
}

/**
 * Returns the last chunk of the given type
 * @name chunkByType
 * @param {string} chunkType - type of RIFF chunk
 * @returns {BaseChunk} - chunk with the given type or undefined
 */
ListChunk.prototype.chunkByType = function (chunkType) {
  return _.find(this.chunks, {type: chunkType});
}

/**
 * Adds a chunk to the end of the list of chunks
 * @name add
 * @returns {BaseChunk} - chunk to add
 */
ListChunk.prototype.add = function (chunk) {
  this.chunks.push(chunk);
  this.size = _chunkSize(this);
}

/**
 * Returns the number of chunks in the list
 * @name length
 * @returns {number} - number of chunks in list
 */
Object.defineProperty(ListChunk.prototype, "length", {
  get: function() {
    return this.chunks.length;
  }
});

module.exports = ListChunk;
