/**
 * @file Implements the FmtChunk class.
 * @copyright Stephen R. Veit 2015
 */
'use strict';
var lodash = require('lodash'),
  Chunk = require('../riff/chunk');

/**
 * A fmt chunk stores important information about the contents of the
 * WAVE file. It stores the number of samples in the file.
 * @class FmtChunk
 */
/**
 * Creates a fmt chunk that contains the number of samples in a WAVE file.
 * @name FmtChunk.createFmtChunk
 * @function
 * @param {object} spec
 * @param {number} [spec.formatTag] - WAVE format category of the
 *   file. Defaults to 1.
 * @param {number} [spec.channels] - number of channels represented in
 *   the waveform data, such as 1 for mono or 2 for stereo. Defaults
 *   to 1.
 * @param {number} [spec.samplesPerSecond] - sampling rate (in samples
 *   per second) at which each channel should be played. Defaults to
 *   8000.
 * @param {number} [spec.avgBytesPerSec] - average number of bytes per
 *   second at which the waveform data should be transferred. Playback
 *   software can estimate the buffer size using this value. Defaults
 *   to 8000.
 * @param {number} [spec.blockAlign] - block alignment (in bytes) of
 *   the waveform data. Playback software needs to process a multiple
 *   of blockAlign bytes of data at a time, so the value of blockAlign
 *   can be used for buffer alignment. Defaults to 1.
 * @param {number} [spec.bitsPerSample] - number of bits of data used
 *   to represent each sample of each channel. If there are multiple
 *   channels, the sample size is the same for each channel. Defaults
 *   to 8.
 * @param {number} [spec.cbSize] - count in bytes of the extra size of
 *   the fmt chunk. Defaults to 0.
 * @param {Buffer} [spec.contents] - encoded byte contents of the chunk.
 * @param {number} [spec.offset] - position from start of buffer of
 *   encoded chunk.
 */
function createFmtChunk(spec) {
  var formatTag, channels, samplesPerSecond, avgBytesPerSec, blockAlign,
    bitsPerSample, cbSize, data, that,
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
      var values = [that.formatTag, that.channels, that.samplesPerSecond,
                    that.avgBytesPerSec, that.blockAlign, that.bitsPerSample];
      values.push(that.cbSize);
      return values.join(', ');
    };

  spec = spec || {};
  if (spec.contents) {
    that = Chunk.createChunk(spec);
  } else {
    formatTag = (spec && spec.formatTag) || 1;
    channels = (spec && spec.channels) || 1;
    samplesPerSecond = (spec && spec.samplesPerSecond) || 8000;
    avgBytesPerSec = (spec && spec.avgBytesPerSec) || 8000;
    blockAlign = (spec && spec.blockAlign) || 1;
    bitsPerSample = (spec && spec.bitsPerSample) || 8;
    cbSize = (spec && spec.cbSize) || 0;
    data = new Buffer(18);
    data.writeUInt16LE(formatTag, 0);
    data.writeUInt16LE(channels, 2);
    data.writeUInt32LE(samplesPerSecond, 4);
    data.writeUInt32LE(avgBytesPerSec, 8);
    data.writeUInt16LE(blockAlign, 12);
    data.writeUInt16LE(bitsPerSample, 14);
    data.writeUInt16LE(cbSize, 16);
    that = Chunk.createChunk({id: 'fmt ', data: data});
  }

  /**
   * The WAVE format category of the file.
   * @name FmtChunk#formatTag
   */
  Object.defineProperty(that, "formatTag", {
    get: function () {
      return that.data.readUInt16LE(0);
    }
  });
  /**
   * The number of channels represented in the waveform data, such as
   *   1 for mono or 2 for stereo.
   * @name FmtChunk#channels
   */
  Object.defineProperty(that, "channels", {
    get: function () {
      return that.data.readUInt16LE(2);
    }
  });
  /**
   * The sampling rate (in samples per second) at which each channel
   *   should be played.
   * @name FmtChunk#samplesPerSecond
   */
  Object.defineProperty(that, "samplesPerSecond", {
    get: function () {
      return that.data.readUInt32LE(4);
    }
  });
  /**
   * The average number of bytes per second at which the waveform data
   *   should be transferred. Playback software can estimate the
   *   buffer size using this value.
   * @name FmtChunk#avgBytesPerSec
   */
  Object.defineProperty(that, "avgBytesPerSec", {
    get: function () {
      return that.data.readUInt32LE(8);
    }
  });
  /**
   * The block alignment (in bytes) of the waveform data. Playback
   *   software needs to process a multiple of blockAlign bytes of
   *   data at a time, so the value of blockAlign can be used for
   *   buffer alignment.
   * @name FmtChunk#blockAlign
   */
  Object.defineProperty(that, "blockAlign", {
    get: function () {
      return that.data.readUInt16LE(12);
    }
  });
  /**
   * The number of bits of data used to represent each sample of each
   *   channel. If there are multiple channels, the sample size is the
   *   same for each channel.
   * @name FmtChunk#bitsPerSample
   */
  Object.defineProperty(that, "bitsPerSample", {
    get: function () {
      return that.data.readUInt16LE(14);
    }
  });
  /**
   * The count in bytes of the extra size of the fmt chunk.
   * @name FmtChunk#cbSize
   */
  Object.defineProperty(that, "cbSize", {
    get: function () {
      return that.data.length >= 18 ? that.data.readUInt16LE(16) : 0;
    }
  });

  that.dataDescription = dataDescription;

  return that;
}

Chunk.registerChunkConstructor('fmt ', createFmtChunk);

exports.createFmtChunk = createFmtChunk;
