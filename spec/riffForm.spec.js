/**
 * @file Tests the RiffForm class
 * @copyright Stephen R. Veit 2015
 */
'use strict';
var Chunk = require('../riff/chunk'),
  RiffForm = require('../riff/riffForm'),
  util = require('util'),
  _ = require('lodash');

describe('RiffForm', function () {
  var chunk;
  describe('new chunk with parameters', function () {
    var chunkOne, chunkTwo;
    beforeEach(function (done) {
      chunkOne = Chunk.createChunk({id: 'one '});
      chunkTwo = Chunk.createChunk({id: 'two '});
      chunk = RiffForm.createRiffForm({
        chunks: [chunkOne, chunkTwo],
        formType: 'WAVE'
      });
      done();
    });
    it('should exist', function (done) {
      expect(chunk).not.toBeUndefined();
      done();
    });
    it('should have chunkWithId', function (done) {
      expect(chunk.chunkWithId('one ')).toEqual(chunkOne);
      done();
    });
    it('should have a length', function (done) {
      expect(chunk.length).toBe(2);
      done();
    });
    it('should have a id of "RIFF"', function (done) {
      expect(chunk.id).toBe('RIFF');
      done();
    });
    it('should have a formType of "WAVE"', function (done) {
      expect(chunk.formType).toBe('WAVE');
      done();
    });
    it('should have chunks', function (done) {
      expect(chunk.chunks).not.toBeUndefined();
      expect(chunk.chunks.length).not.toBe(1);
      expect(chunk.chunks).toEqual([chunkOne, chunkTwo]);
      done();
    });
    it('should have a size of 20', function (done) {
      expect(chunk.size).toBe(20);
      done();
    });
    it('should have contents', function (done) {
      var expectedContents = new Buffer(28);
      expectedContents.write('RIFF', 0, 4, 'ascii');
      expectedContents.writeUInt32LE(20, 4);
      expectedContents.write('WAVE', 8, 4, 'ascii');
      expectedContents.write('one ', 12, 4, 'ascii');
      expectedContents.writeUInt32LE(0, 16);
      expectedContents.write('two ', 20, 4, 'ascii');
      expectedContents.writeUInt32LE(0, 24);
      expect(chunk.contents.length).toBe(28);
      _.forEach(chunk.contents, function (byte, i) {
        expect(byte).toBe(expectedContents[i]);
      });
      done();
    });
    it('should have a description', function (done) {
      expect(chunk.description())
        .toBe('RIFF(\'WAVE\'  one (0)\n' +
              '             two (0))');
      done();
    });
    describe('description with indentation of 4', function () {
      var description;
      beforeEach(function (done) {
        description = '    ' + chunk.description(4);
        done();
      });
      it('should start with four spaces', function (done) {
        expect(description)
          .toBe('    RIFF(\'WAVE\'  one (0)\n' +
                '                 two (0))');
        done();
      });
    });
  });
  describe('createChunkFromBuffer with riffForm contents', function () {
    beforeEach(function (done) {
      var contents = new Buffer(32);
      contents.write('RIFF', 0, 4, 'ascii');
      contents.writeUInt32LE(24, 4);
      contents.write('WAVE', 8, 4, 'ascii');
      contents.write('one ', 12, 4, 'ascii');
      contents.writeUInt32LE(4, 16);
      contents.writeUInt32LE(1234, 20);
      contents.write('two ', 24, 4, 'ascii');
      contents.writeUInt32LE(0, 28);
      chunk = Chunk.createChunkFromBuffer({contents: contents});
      done();
    });

    it('should exist', function (done) {
      expect(chunk).not.toBeUndefined();
      done();
    });
    it('should have a id of "RIFF"', function (done) {
      expect(chunk.id).toBe('RIFF');
      done();
    });
    it('should have a size of 24', function (done) {
      expect(chunk.size).toBe(24);
      done();
    });
    it('should have bufferLength', function (done) {
      expect(chunk.bufferLength).toBe(32);
      done();
    });
    it('should have a formType of "WAVE"', function (done) {
      expect(chunk.formType).toBe('WAVE');
      done();
    });
    it('should have a length', function (done) {
      expect(chunk.length).toBe(2);
      done();
    });
    it('should have chunks', function (done) {
      expect(chunk.chunks).not.toBeUndefined();
      expect(chunk.chunks.length).toBe(2);
      expect(chunk.chunks[0].id).toBe('one ');
      expect(chunk.chunks[1].id).toBe('two ');
      done();
    });
    it('should have chunkWithId', function (done) {
      expect(chunk.chunkWithId('one ')).not.toBeUndefined();
      expect(chunk.chunkWithId('one ').id).toBe('one ');
      expect(chunk.chunkWithId('two ')).not.toBeUndefined();
      expect(chunk.chunkWithId('two ').id).toBe('two ');
      done();
    });
  });
  describe('new chunk with no parameters', function () {
    beforeEach(function (done) {
      chunk = RiffForm.createRiffForm();
      done();
    });
    it('should exist', function (done) {
      expect(chunk).not.toBeUndefined();
      done();
    });
    it('should have chunkWithId', function (done) {
      expect(chunk.chunkWithId('foo ')).toBeUndefined();
      done();
    });
    it('should have a length', function (done) {
      expect(chunk.length).toBe(0);
      done();
    });
    it('should have a id of "RIFF"', function (done) {
      expect(chunk.id).toBe('RIFF');
      done();
    });
    it('should have a formType of "    "', function (done) {
      expect(chunk.formType).toBe('    ');
      done();
    });
    it('should have chunks', function (done) {
      expect(chunk.chunks).toEqual([]);
      done();
    });
    it('should have a size of 4', function (done) {
      expect(chunk.size).toBe(4);
      done();
    });
    it('should have contents', function (done) {
      var expectedContents = new Buffer(12);
      expectedContents.write('RIFF', 0, 4, 'ascii');
      expectedContents.writeUInt32LE(4, 4);
      expectedContents.write('    ', 8, 4, 'ascii');
      expect(chunk.bufferLength).toBe(12);
      _.forEach(chunk.contents, function (byte, i) {
        expect(byte).toBe(expectedContents[i]);
      });
      done();
    });
    describe('when adding a chunk', function () {
      var subChunk;
      beforeEach(function (done) {
        subChunk = Chunk.createChunk({id: 'foo '});
        chunk.add(subChunk);
        done();
      });
      it('should have a length of 1', function (done) {
        expect(chunk.length).toBe(1);
        done();
      });
      it('should have chunkWithId', function (done) {
        expect(chunk.chunkWithId('foo ')).toBe(subChunk);
        done();
      });
      it('should have chunks', function (done) {
        expect(chunk.chunks).toEqual([subChunk]);
        done();
      });
      it('should have a size of 12', function (done) {
        expect(chunk.size).toBe(12);
        done();
      });
      it('should have contents', function (done) {
        var expectedContents = new Buffer(20);
        expectedContents.write('RIFF', 0, 4, 'ascii');
        expectedContents.writeUInt32LE(12, 4);
        expectedContents.write('    ', 8, 4, 'ascii');
        expectedContents.write('foo ', 12, 4, 'ascii');
        expectedContents.writeUInt32LE(0, 16);
        expect(chunk.contents.length).toBe(20);
        _.forEach(chunk.contents, function (byte, i) {
          expect(byte).toBe(expectedContents[i]);
        });
        done();
      });
    });
  });
});

