/**
 * @file Tests the Chunk class
 * @copyright Stephen R. Veit 2015
 */
var Chunk = require('../riff/chunk'),
    util = require('util'),
    _ = require('lodash');

describe('Chunk', function () {
  var chunk;
  describe('with id and size parameters', function () {
    beforeEach(function (done) {
      chunk = Chunk.createChunk({id: 'RIFF', size: 5});
      done();
    });
    it('should return a chunk', function (done) {
      expect(chunk).not.toBeUndefined();
      done();
    });
    it('should have a id of "RIFF"', function (done) {
      expect(chunk.id).toBe('RIFF');
      done();
    });
    it('should have bufferLength', function (done) {
      expect(chunk.bufferLength).toBe(13);
      done();
    });
    it('should have a size', function (done) {
      expect(chunk.size).toBe(5);
      done();
    });
    it('should contents', function (done) {
      expect(Buffer.isBuffer(chunk.contents)).toBe(true);
      done();
    });
  });
  describe('with no parameters', function () {
    beforeEach(function (done) {
      chunk = Chunk.createChunk();
      done();
    });
    it('should return a chunk', function (done) {
      expect(chunk).not.toBeUndefined();
      done();
    });
    it('should have a id of "    "', function (done) {
      expect(chunk.id).toBe('    ');
      done();
    });
    it('should have bufferLength', function (done) {
      expect(chunk.bufferLength).toBe(8);
      done();
    });
    it('should have a size of 0', function (done) {
      expect(chunk.size).toBe(0);
      done();
    });
    it('should have contents', function (done) {
      var expectedContents = new Buffer(8);
      expectedContents.writeUInt32BE(0x20202020, 0);
      expectedContents.writeUInt32BE(0, 4);
      expect(chunk.contents.length).toBe(8);
      _.forEach(chunk.contents, function (byte, i) {
        expect(byte).toBe(expectedContents[i]);
      });
      done();
    });
    it('should have a id of "    "', function (done) {
      expect(chunk.id).toBe('    ');
      done();
    });
    it('should have bufferLength', function (done) {
      expect(chunk.bufferLength).toBe(8);
      done();
    });
    it('should have a size', function (done) {
      expect(chunk.size).toBe(0);
      done();
    });
    describe('and setContents called', function () {
      beforeEach(function (done) {
        var contents = new Buffer(12);
        contents.writeUInt32BE(0x52494646, 0);
        contents.writeUInt32BE(4, 4);
        chunk.setContents(contents);
        done();
      });
      it('should have a id of "RIFF"', function (done) {
        expect(chunk.id).toBe('RIFF');
        done();
      });
      it('should have a bufferLength', function (done) {
        expect(chunk.bufferLength).toBe(12);
        done();
      });
      it('should have a size', function (done) {
        expect(chunk.size).toBe(4);
        done();
      });
    });
  });
  describe('chunkConstructor', function () {
    var myConstructor = function () {};
    beforeEach(function (done) {
      Chunk.registerChunkConstructor('mcla', myConstructor);
      done();
    });
    it('should return the chunk class', function (done) {
      expect(Chunk.chunkConstructor('mcla')).toBe(myConstructor);
      done();
    });
  });
  describe('createChunkFromBuffer with returned chunk', function () {
    var myConstructor, chunk;
    beforeEach(function (done) {
      var contents = new Buffer(12);
      contents.writeUInt32BE(0x52494646, 0);
      contents.write('mcla', 0, 4, 'ascii');
      myConstructor = function (spec) {
        var that = Chunk.createChunk(spec);
        return that;
      };
      Chunk.registerChunkConstructor('mcla', myConstructor);
      chunk = Chunk.createChunkFromBuffer(contents);
      done();
    });
    it('should exist', function (done) {
      expect(chunk).not.toBeUndefined();
      done();
    });
    it('should have a id', function (done) {
      expect(chunk.id).toBe('mcla');
      done();
    });
  });
});
