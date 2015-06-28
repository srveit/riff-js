/**
 * @file Implements the ListChunk class
 * @copyright Stephen R. Veit 2015
 */
var _ = require('lodash'),
    util = require('util'),
    BaseChunk = require('../riff/baseChunk'),
    chunkClasses = {};

/**
 * Creates a RIFF chunk that contains a list of RIFF chunks
 * @class
 * @property {BaseChunk[]} chunks - chunks contained in list
 * @property {string} listType - four character type of list
 * @param {BaseChunk[]} args.chunks - chunks contained in
 *   list. Defaults to []
 * @param {string} args.listType - four character type of
 *   list. Defaults to " "
 * @param {string} args.id - four character ID of chunk. Defaults to
 *   "LIST"
 * 
 */
function ListChunk(args) {
  var id = args && args.id || 'LIST';
  this.chunks = args && args.chunks || [];
  BaseChunk.call(this, id, 4);
  this.writeId(args && args.listType, 8);
  this.contents = Buffer.concat([this.contents]
                                .concat(_.map(this.chunks, 'contents')));
  this.writeSize(this.bufferLength - 8, 4);
}

util.inherits(ListChunk, BaseChunk);

/**
 * The four character list type of chunk
 * @property {string}
 * @name ListChunk#listType
 * @readonly
 */
Object.defineProperty(ListChunk.prototype, 'listType', {
  get: function () {
    if (Buffer.isBuffer(this.contents)) {
      return this.contents.toString('ascii', 8, 12);
    } else {
      return undefined;
    }
  }
});

function _chunkSize(listChunk) {
  return _.reduce(listChunk.chunks, function (sum, chunk) {
    return sum + (chunk.bufferLength || 0);
  }, 4);
}

/**
 * Returns the last chunk of the given ID
 * @name chunkById
 * @param {string} id - ID of RIFF chunk
 * @returns {BaseChunk} - chunk with the given ID or undefined
 */
ListChunk.prototype.chunkById = function (id) {
  return _.find(this.chunks, {id: id});
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
