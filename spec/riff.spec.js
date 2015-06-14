var riff = require('../riff/riff'),
      util = require('util'),
    _ = require('lodash');

describe('riff', function () {
  describe('BaseChunk', function () {
    var chunk;
    describe('with type and size parameters', function () {
      beforeEach(function (done) {
        chunk = new riff.BaseChunk('RIFF', 5);
        done();
      });
      it('should return a chunk', function (done) {
        expect(chunk).not.toBeUndefined();
        done();
      });
      it('should have a type of "RIFF"', function (done) {
        expect(chunk.type).toBe('RIFF');
        done();
      });
      it('should have bufferLength', function (done) {
        expect(chunk.bufferLength).toBe(8);
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
        chunk = new riff.BaseChunk();
        done();
      });
      it('should return a chunk', function (done) {
        expect(chunk).not.toBeUndefined();
        done();
      });
      it('should have a type of "    "', function (done) {
        expect(chunk.type).toBe('    ');
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
      it('should have a type of "    "', function (done) {
        expect(chunk.type).toBe('    ');
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
        it('should have a type of "RIFF"', function (done) {
          expect(chunk.type).toBe('RIFF');
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
        riff.BaseChunk.registerChunkClass('mcla', MyClass);
        done();
      });
      it('should return the chunk class', function (done) {
        expect(riff.BaseChunk.chunkClass('mcla')).toBe(MyClass);
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
        util.inherits(MyClass, riff.BaseChunk);
        riff.BaseChunk.registerChunkClass('mcla', MyClass);
        chunk = riff.BaseChunk.createChunk(contents);
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
      it('should have a type', function (done) {
        expect(chunk.type).toBe('mcla');
        done();
      });
    });
  });
  describe('decodeRiff', function () {
    var file;
    beforeEach(function (done) {
      file = riff.decodeRiff('RIFF');
      done();
    });
    it('should decode file', function (done) {
      expect(file).not.toBeUndefined();
      done();
    });
  });
});
