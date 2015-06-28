/**
 * @file Tests the BaseChunk class
 * @copyright Stephen R. Veit 2015
 */
var BaseChunk = require('../riff/BaseChunk'),
    util = require('util'),
    _ = require('lodash');

describe('BaseChunk', function () {
  var chunk;
  describe('with id and size parameters', function () {
    beforeEach(function (done) {
      chunk = new BaseChunk('RIFF', 5);
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
      chunk = new BaseChunk();
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
  describe('chunkClass', function () {
    var MyClass = function () {};
    beforeEach(function (done) {
      BaseChunk.registerChunkClass('mcla', MyClass);
      done();
    });
    it('should return the chunk class', function (done) {
      expect(BaseChunk.chunkClass('mcla')).toBe(MyClass);
      done();
    });
  });
  describe('createChunk with returned chunk', function () {
    var MyClass, chunk;
    beforeEach(function (done) {
      var contents = new Buffer(12);
      contents.writeUInt32BE(0x52494646, 0);
      contents.write('mcla', 0, 4, 'ascii');
      MyClass = function () {};
      util.inherits(MyClass, BaseChunk);
      BaseChunk.registerChunkClass('mcla', MyClass);
      chunk = BaseChunk.createChunk(contents);
      done();
    });
    it('should exist', function (done) {
      expect(chunk).not.toBeUndefined();
      done();
    });
    it('should have the correct class', function (done) {
      expect(chunk.constructor).toBe(MyClass);
      done();
    });
    it('should have a id', function (done) {
      expect(chunk.id).toBe('mcla');
      done();
    });
  });
});
