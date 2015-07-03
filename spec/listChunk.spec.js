/**
 * @file Tests the ListChunk class
 * @copyright Stephen R. Veit 2015
 */
var Chunk = require('../riff/chunk'),
    ListChunk = require('../riff/ListChunk'),
    util = require('util'),
    _ = require('lodash');

describe('ListChunk', function () {
  var chunk;
  describe('new chunk with parameters', function () {
    var chunkOne, chunkTwo;
    beforeEach(function (done) {
      chunkOne = Chunk.createChunk({id: 'one '});
      chunkTwo = Chunk.createChunk({id: 'two '});
      chunk = ListChunk.createListChunk({
        chunks: [chunkOne, chunkTwo],
        listType: 'WAVE',
        id: 'RIFF'
      });
      done();
    });
    it('should exist', function (done) {
      expect(chunk).not.toBeUndefined();
      done();
    });
    it('should have chunkById', function (done) {
      expect(chunk.chunkById('one ')).toEqual(chunkOne);
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
    it('should have a listType of "WAVE"', function (done) {
      expect(chunk.listType).toBe('WAVE');
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
      var expectedContents = new Buffer(8);
      expectedContents.write('RIFF', 0, 4, 'ascii');
      expectedContents.writeUInt32BE(20, 4);
      expectedContents.write('WAVE', 8, 4, 'ascii');
      expect(chunk.contents.length).toBe(28);
      // _.forEach(chunk.contents, function (byte, i) {
      //   expect(byte).toBe(expectedContents[i]);
      // });
      done();
    });
  });
  describe('new chunk with no parameters', function () {
    beforeEach(function (done) {
      chunk = ListChunk.createListChunk();
      done();
    });
    it('should exist', function (done) {
      expect(chunk).not.toBeUndefined();
      done();
    });
    it('should have chunkById', function (done) {
      expect(chunk.chunkById('foo ')).toBeUndefined();
      done();
    });
    it('should have a length', function (done) {
      expect(chunk.length).toBe(0);
      done();
    });
    it('should have a id of "LIST"', function (done) {
      expect(chunk.id).toBe('LIST');
      done();
    });
    it('should have a listType of "    "', function (done) {
      expect(chunk.listType).toBe('    ');
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
      expectedContents.write('LIST', 0, 4, 'ascii');
      expectedContents.writeUInt32BE(4, 4);
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
      it('should have chunkById', function (done) {
        expect(chunk.chunkById('foo ')).toBe(subChunk);
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
        expectedContents.write('LIST', 0, 4, 'ascii');
        expectedContents.writeUInt32BE(12, 4);
        expectedContents.write('    ', 8, 4, 'ascii');
        expectedContents.write('foo ', 12, 4, 'ascii');
        expectedContents.writeUInt32BE(0, 16);
        expect(chunk.contents.length).toBe(20);
        _.forEach(chunk.contents, function (byte, i) {
          expect(byte).toBe(expectedContents[i]);
        });
        done();
      });
    });
  });
});

