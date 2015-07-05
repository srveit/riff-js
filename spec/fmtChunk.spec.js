/**
 * @file Tests the FmtChunk class
 * @copyright Stephen R. Veit 2015
 */
'use strict';
var Chunk = require('../riff/chunk'),
  FmtChunk = require('../riff/fmtChunk'),
  util = require('util'),
  _ = require('lodash');

describe('FmtChunk', function () {
  var chunk;
  describe('new chunk with parameters', function () {
    beforeEach(function (done) {
      chunk = FmtChunk.createFmtChunk({
        formatTag: 1,
        channels: 1,
        samplesPerSecond: 8000,
        avgBytesPerSec: 8000,
        blockAlign: 1,
        bitsPerSample: 8
      });
      done();
    });
    it('should exist', function (done) {
      expect(chunk).not.toBeUndefined();
      done();
    });
    it('should have a id of "fmt "', function (done) {
      expect(chunk.id).toBe('fmt ');
      done();
    });
    it('should have a size of 18', function (done) {
      expect(chunk.size).toBe(18);
      done();
    });
    it('should have bufferLength', function (done) {
      expect(chunk.bufferLength).toBe(26);
      done();
    });
    it('should have a formatTag of 1', function (done) {
      expect(chunk.formatTag).toBe(1);
      done();
    });
    it('should have a channels of 1', function (done) {
      expect(chunk.channels).toBe(1);
      done();
    });
    it('should have a samplesPerSecond of 8000', function (done) {
      expect(chunk.samplesPerSecond).toBe(8000);
      done();
    });
    it('should have a avgBytesPerSec of 8000', function (done) {
      expect(chunk.avgBytesPerSec).toBe(8000);
      done();
    });
    it('should have a blockAlign of 1', function (done) {
      expect(chunk.blockAlign).toBe(1);
      done();
    });
    it('should have a bitsPerSample of 8', function (done) {
      expect(chunk.bitsPerSample).toBe(8);
      done();
    });
    it('should have a cbSize of 0', function (done) {
      expect(chunk.cbSize).toBe(0);
      done();
    });
    it('should have contents', function (done) {
      var expectedContents = new Buffer(26);
      expectedContents.write('fmt ', 0, 4, 'ascii');
      expectedContents.writeUInt32LE(18, 4);
      expectedContents.writeUInt16LE(1, 8);
      expectedContents.writeUInt16LE(1, 10);
      expectedContents.writeUInt32LE(8000, 12);
      expectedContents.writeUInt32LE(8000, 16);
      expectedContents.writeUInt16LE(1, 20);
      expectedContents.writeUInt16LE(8, 22);
      expectedContents.writeUInt16LE(0, 24);
      expect(chunk.contents.length).toBe(26);
      _.forEach(chunk.contents, function (byte, i) {
        expect(byte).toBe(expectedContents[i]);
      });
      done();
    });
    it('should have a description', function (done) {
      expect(chunk.description()).toBe('fmt (1, 1, 8000, 8000, 1, 8, 0)');
      done();
    });
    describe('description with indentation of 4', function () {
      var description;
      beforeEach(function (done) {
        description = '    ' + chunk.description(4);
        done();
      });
      it('should start with four spaces', function (done) {
        expect(description).toBe('    fmt (1, 1, 8000, 8000, 1, 8, 0)');
        done();
      });
    });
  });
  describe('createChunkFromBuffer with fmtChunk 8-bit uLaw', function () {
    beforeEach(function (done) {
      var contents = new Buffer(26);
      contents.write('fmt ', 0, 4, 'ascii');
      contents.writeUInt32LE(18, 4);
      contents.writeUInt16LE(7, 8);
      contents.writeUInt16LE(1, 10);
      contents.writeUInt32LE(8000, 12);
      contents.writeUInt32LE(8000, 16);
      contents.writeUInt16LE(1, 20);
      contents.writeUInt16LE(8, 22);
      contents.writeUInt16LE(0, 24);
      chunk = Chunk.createChunkFromBuffer({contents: contents});
      done();
    });

    it('should exist', function (done) {
      expect(chunk).not.toBeUndefined();
      done();
    });
    it('should have a id of "fmt "', function (done) {
      expect(chunk.id).toBe('fmt ');
      done();
    });
    it('should have a size of 18', function (done) {
      expect(chunk.size).toBe(18);
      done();
    });
    it('should have bufferLength', function (done) {
      expect(chunk.bufferLength).toBe(26);
      done();
    });
    it('should have a formatTag of 7', function (done) {
      expect(chunk.formatTag).toBe(7);
      done();
    });
    it('should have a channels of 1', function (done) {
      expect(chunk.channels).toBe(1);
      done();
    });
    it('should have a samplesPerSecond of 8000', function (done) {
      expect(chunk.samplesPerSecond).toBe(8000);
      done();
    });
    it('should have a avgBytesPerSec of 8000', function (done) {
      expect(chunk.avgBytesPerSec).toBe(8000);
      done();
    });
    it('should have a blockAlign of 1', function (done) {
      expect(chunk.blockAlign).toBe(1);
      done();
    });
    it('should have a bitsPerSample of 8', function (done) {
      expect(chunk.bitsPerSample).toBe(8);
      done();
    });
    it('should have a cbSize of 0', function (done) {
      expect(chunk.cbSize).toBe(0);
      done();
    });
  });
  describe('createChunkFromBuffer with fmtChunk 16-bit PCM', function () {
    beforeEach(function (done) {
      var contents = new Buffer(24);
      contents.write('fmt ', 0, 4, 'ascii');
      contents.writeUInt32LE(16, 4);
      contents.writeUInt16LE(1, 8);
      contents.writeUInt16LE(1, 10);
      contents.writeUInt32LE(8000, 12);
      contents.writeUInt32LE(16000, 16);
      contents.writeUInt16LE(2, 20);
      contents.writeUInt16LE(16, 22);
      chunk = Chunk.createChunkFromBuffer({contents: contents});
      done();
    });

    it('should exist', function (done) {
      expect(chunk).not.toBeUndefined();
      done();
    });
    it('should have a id of "fmt "', function (done) {
      expect(chunk.id).toBe('fmt ');
      done();
    });
    it('should have a size of 16', function (done) {
      expect(chunk.size).toBe(16);
      done();
    });
    it('should have bufferLength', function (done) {
      expect(chunk.bufferLength).toBe(24);
      done();
    });
    it('should have a formatTag of 1', function (done) {
      expect(chunk.formatTag).toBe(1);
      done();
    });
    it('should have a channels of 1', function (done) {
      expect(chunk.channels).toBe(1);
      done();
    });
    it('should have a samplesPerSecond of 8000', function (done) {
      expect(chunk.samplesPerSecond).toBe(8000);
      done();
    });
    it('should have a avgBytesPerSec of 16000', function (done) {
      expect(chunk.avgBytesPerSec).toBe(16000);
      done();
    });
    it('should have a blockAlign of 2', function (done) {
      expect(chunk.blockAlign).toBe(2);
      done();
    });
    it('should have a bitsPerSample of 16', function (done) {
      expect(chunk.bitsPerSample).toBe(16);
      done();
    });
    it('should have a cbSize of 0', function (done) {
      expect(chunk.cbSize).toBe(0);
      done();
    });
  });
  describe('new chunk with no parameters', function () {
    beforeEach(function (done) {
      chunk = FmtChunk.createFmtChunk();
      done();
    });
    it('should exist', function (done) {
      expect(chunk).not.toBeUndefined();
      done();
    });
    it('should have a id of "fmt "', function (done) {
      expect(chunk.id).toBe('fmt ');
      done();
    });
    it('should have a size of 18', function (done) {
      expect(chunk.size).toBe(18);
      done();
    });
    it('should have bufferLength', function (done) {
      expect(chunk.bufferLength).toBe(26);
      done();
    });
    it('should have a formatTag of 1', function (done) {
      expect(chunk.formatTag).toBe(1);
      done();
    });
    it('should have a channels of 1', function (done) {
      expect(chunk.channels).toBe(1);
      done();
    });
    it('should have a samplesPerSecond of 8000', function (done) {
      expect(chunk.samplesPerSecond).toBe(8000);
      done();
    });
    it('should have a avgBytesPerSec of 8000', function (done) {
      expect(chunk.avgBytesPerSec).toBe(8000);
      done();
    });
    it('should have a blockAlign of 1', function (done) {
      expect(chunk.blockAlign).toBe(1);
      done();
    });
    it('should have a bitsPerSample of 8', function (done) {
      expect(chunk.bitsPerSample).toBe(8);
      done();
    });
    it('should have a cbSize of 0', function (done) {
      expect(chunk.cbSize).toBe(0);
      done();
    });
    it('should have contents', function (done) {
      var expectedContents = new Buffer(26);
      expectedContents.write('fmt ', 0, 4, 'ascii');
      expectedContents.writeUInt32LE(18, 4);
      expectedContents.writeUInt16LE(1, 8);
      expectedContents.writeUInt16LE(1, 10);
      expectedContents.writeUInt32LE(8000, 12);
      expectedContents.writeUInt32LE(8000, 16);
      expectedContents.writeUInt16LE(1, 20);
      expectedContents.writeUInt16LE(8, 22);
      expectedContents.writeUInt16LE(0, 24);
      expect(chunk.contents.length).toBe(26);
      _.forEach(chunk.contents, function (byte, i) {
        expect(byte).toBe(expectedContents[i]);
      });
      done();
    });
  });
});
