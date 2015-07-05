/**
 * @file Tests the FactChunk class
 * @copyright Stephen R. Veit 2015
 */
'use strict';
var Chunk = require('../riff/chunk'),
  FactChunk = require('../riff/factChunk'),
  util = require('util'),
  _ = require('lodash');

describe('FactChunk', function () {
  var chunk;
  describe('new chunk with parameters', function () {
    beforeEach(function (done) {
      chunk = FactChunk.createFactChunk({
        fileSize: 100000
      });
      done();
    });
    it('should exist', function (done) {
      expect(chunk).not.toBeUndefined();
      done();
    });
    it('should have a id of "fact"', function (done) {
      expect(chunk.id).toBe('fact');
      done();
    });
    it('should have a size of 4', function (done) {
      expect(chunk.size).toBe(4);
      done();
    });
    it('should have bufferLength', function (done) {
      expect(chunk.bufferLength).toBe(12);
      done();
    });
    it('should have a fileSize of 100000', function (done) {
      expect(chunk.fileSize).toBe(100000);
      done();
    });
    it('should have contents', function (done) {
      var expectedContents = new Buffer(12);
      expectedContents.write('fact', 0, 4, 'ascii');
      expectedContents.writeUInt32LE(4, 4);
      expectedContents.writeUInt32LE(100000, 8);
      expect(chunk.contents.length).toBe(12);
      _.forEach(chunk.contents, function (byte, i) {
        expect(byte).toBe(expectedContents[i]);
      });
      done();
    });
    it('should have a description', function (done) {
      expect(chunk.description()).toBe('fact(100000)');
      done();
    });
    describe('description with indentation of 4', function () {
      var description;
      beforeEach(function (done) {
        description = '    ' + chunk.description(4);
        done();
      });
      it('should start with four spaces', function (done) {
        expect(description).toBe('    fact(100000)');
        done();
      });
    });
  });
  describe('createChunkFromBuffer with factChunk contents', function () {
    beforeEach(function (done) {
      var contents = new Buffer(12);
      contents.write('fact', 0, 4, 'ascii');
      contents.writeUInt32LE(4, 4);
      contents.writeUInt32LE(100000, 8);
      chunk = Chunk.createChunkFromBuffer({contents: contents});
      done();
    });

    it('should exist', function (done) {
      expect(chunk).not.toBeUndefined();
      done();
    });
    it('should have a id of "fact"', function (done) {
      expect(chunk.id).toBe('fact');
      done();
    });
    it('should have a size of 4', function (done) {
      expect(chunk.size).toBe(4);
      done();
    });
    it('should have bufferLength', function (done) {
      expect(chunk.bufferLength).toBe(12);
      done();
    });
    it('should have a fileSize of 100000', function (done) {
      expect(chunk.fileSize).toBe(100000);
      done();
    });
  });
  describe('new chunk with no parameters', function () {
    beforeEach(function (done) {
      chunk = FactChunk.createFactChunk();
      done();
    });
    it('should exist', function (done) {
      expect(chunk).not.toBeUndefined();
      done();
    });
    it('should have a id of "fact"', function (done) {
      expect(chunk.id).toBe('fact');
      done();
    });
    it('should have a size of 4', function (done) {
      expect(chunk.size).toBe(4);
      done();
    });
    it('should have a fileSize of 0', function (done) {
      expect(chunk.fileSize).toBe(0);
      done();
    });
    it('should have contents', function (done) {
      var expectedContents = new Buffer(12);
      expectedContents.write('fact', 0, 4, 'ascii');
      expectedContents.writeUInt32LE(4, 4);
      expectedContents.writeUInt32LE(0, 8);
      expect(chunk.bufferLength).toBe(12);
      _.forEach(chunk.contents, function (byte, i) {
        expect(byte).toBe(expectedContents[i]);
      });
      done();
    });
  });
});
