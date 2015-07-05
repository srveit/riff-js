/**
 * @file Tests the ZstrChunk class
 * @copyright Stephen R. Veit 2015
 */
'use strict';
var Chunk = require('../riff/chunk'),
  ZstrChunk = require('../riff/zstrChunk'),
  util = require('util'),
  _ = require('lodash');

describe('ZstrChunk', function () {
  var chunk;
  describe('new chunk with parameters', function () {
    beforeEach(function (done) {
      chunk = ZstrChunk.createZstrChunk({
        id: 'IARL',
        text: 'Archival Location'
      });
      done();
    });
    it('should exist', function (done) {
      expect(chunk).not.toBeUndefined();
      done();
    });
    it('should have a id of "IARL"', function (done) {
      expect(chunk.id).toBe('IARL');
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
    it('should have a text property', function (done) {
      expect(chunk.text).toBe('Archival Location');
      done();
    });
    it('should have contents', function (done) {
      var expectedContents = new Buffer(26);
      expectedContents.write('IARL', 0, 4, 'ascii');
      expectedContents.writeUInt32LE(18, 4);
      expectedContents.write('Archival Location', 8, 17, 'ascii');
      expectedContents.writeUInt8(0, 25);
      expect(chunk.contents.length).toBe(26);
      _.forEach(chunk.contents, function (byte, i) {
        expect(byte).toBe(expectedContents[i]);
      });
      done();
    });
    it('should have a description', function (done) {
      expect(chunk.description()).toBe('IARL("Archival Location"Z)');
      done();
    });
    describe('description with indentation of 4', function () {
      var description;
      beforeEach(function (done) {
        description = '    ' + chunk.description(4);
        done();
      });
      it('should start with four spaces', function (done) {
        expect(description).toBe('    IARL("Archival Location"Z)');
        done();
      });
    });
  });
  describe('createChunkFromBuffer with IARL contents', function () {
    beforeEach(function (done) {
      var contents = new Buffer(26);
      contents.write('IARL', 0, 4, 'ascii');
      contents.writeUInt32LE(18, 4);
      contents.write('Archival Location', 8, 17, 'ascii');
      contents.writeUInt8(0, 25);
      chunk = Chunk.createChunkFromBuffer({contents: contents});
      done();
    });

    it('should exist', function (done) {
      expect(chunk).not.toBeUndefined();
      done();
    });
    it('should have a id of "IARL"', function (done) {
      expect(chunk.id).toBe('IARL');
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
    it('should have text', function (done) {
      expect(chunk.text).toBe('Archival Location');
      done();
    });
  });
  describe('createChunkFromBuffer with ICRD contents', function () {
    beforeEach(function (done) {
      var contents = new Buffer(22);
      contents.write('ICRD', 0, 4, 'ascii');
      contents.writeUInt32LE(14, 4);
      contents.write('Creation Date', 8, 13, 'ascii');
      contents.writeUInt8(0, 21);
      chunk = Chunk.createChunkFromBuffer({contents: contents});
      done();
    });

    it('should exist', function (done) {
      expect(chunk).not.toBeUndefined();
      done();
    });
    it('should have a id of "ICRD"', function (done) {
      expect(chunk.id).toBe('ICRD');
      done();
    });
    it('should have a size of 14', function (done) {
      expect(chunk.size).toBe(14);
      done();
    });
    it('should have bufferLength', function (done) {
      expect(chunk.bufferLength).toBe(22);
      done();
    });
    it('should have text', function (done) {
      expect(chunk.text).toBe('Creation Date');
      done();
    });
  });
  describe('new chunk with no parameters', function () {
    beforeEach(function (done) {
      chunk = ZstrChunk.createZstrChunk();
      done();
    });
    it('should exist', function (done) {
      expect(chunk).not.toBeUndefined();
      done();
    });
    it('should have a id of "zstr"', function (done) {
      expect(chunk.id).toBe('zstr');
      done();
    });
    it('should have a size of 4', function (done) {
      expect(chunk.size).toBe(1);
      done();
    });
    it('should have a text of ""', function (done) {
      expect(chunk.text).toBe('');
      done();
    });
    it('should have contents', function (done) {
      var expectedContents = new Buffer(10);
      expectedContents.write('zstr', 0, 4, 'ascii');
      expectedContents.writeUInt32LE(1, 4);
      expectedContents.writeUInt8(0, 8);
      expectedContents.writeUInt8(0, 9);
      expect(chunk.bufferLength).toBe(10);
      _.forEach(chunk.contents, function (byte, i) {
        expect(byte).toBe(expectedContents[i]);
      });
      done();
    });
  });
});
