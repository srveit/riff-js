(function (module) {
  /**
   * The basic data structure in a RIFF file.
   * @constructor
   * @param {string} type - The four character type of chunk.
   * @param {string} size - the number of bytes in the chunk not
   *   including the chunkType.
   */
  function BaseChunk() {
    this.type = '    ';
    this.size = 0;
  }

  function Riff() {
  }

  function decodeRiff(fileContents) {
    return new Riff(fileContents);
  }

  module.exports = {
    BaseChunk: BaseChunk,
    decodeRiff: decodeRiff
  };
})(module);
