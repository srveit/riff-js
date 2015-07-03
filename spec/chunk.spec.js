/**
 * @file Tests the Chunk class
 * @copyright Stephen R. Veit 2015
 */
'use strict';
var Chunk = require('../riff/chunk'),
  _ = require('lodash');

describe('Chunk', function () {
  var chunk;
  describe('with id and data parameters', function () {
    var data;
    beforeEach(function (done) {
      data = new Buffer(5);
      chunk = Chunk.createChunk({id: 'RIFF', data: data});
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
      expect(chunk.bufferLength).toBe(14);
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
    it('should have decodeString', function (done) {
      expect(chunk.decodeString(0, 4)).toBe('RIFF');
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
    describe('and data is appended', function () {
      beforeEach(function (done) {
        chunk.appendData(new Buffer(7));
        done();
      });
      it('should have increased bufferLength', function (done) {
        expect(chunk.bufferLength).toBe(15);
        done();
      });
      it('should have increased size', function (done) {
        expect(chunk.size).toBe(7);
        done();
      });
    });
  });
  describe('createChunkFromBuffer', function () {
    describe('with no offset', function () {
      var myConstructor;
      beforeEach(function (done) {
        var contents = new Buffer(22);
        contents.write('mcla', 0, 4, 'ascii');
        contents.writeUInt32BE(4, 4);
        contents.writeUInt32BE(1234, 8);
        myConstructor = function (spec) {
          var that = Chunk.createChunk(spec);
          return that;
        };
        Chunk.registerChunkConstructor('mcla', myConstructor);
        chunk = Chunk.createChunkFromBuffer({contents: contents});
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
    describe('with an offset', function () {
      var myConstructor;
      beforeEach(function (done) {
        var contents = new Buffer(21);
        contents.write('mcla', 10, 4, 'ascii');
        contents.writeUInt32BE(3, 14);
        myConstructor = function (spec) {
          var that = Chunk.createChunk(spec);
          return that;
        };
        Chunk.registerChunkConstructor('mcla', myConstructor);
        chunk = Chunk.createChunkFromBuffer({contents: contents, offset: 10});
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
      it('should have bufferLength', function (done) {
        expect(chunk.bufferLength).toBe(12);
        done();
      });
      it('should have a size', function (done) {
        expect(chunk.size).toBe(3);
        done();
      });
    });
  });
});
