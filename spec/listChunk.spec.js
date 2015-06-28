/**
 * @file Tests the ListChunk class
 * @copyright Stephen R. Veit 2015
 */
var BaseChunk = require('../riff/baseChunk'),
    ListChunk = require('../riff/ListChunk'),
    util = require('util'),
    _ = require('lodash');

describe('ListChunk', function () {
  var chunk;
  describe('new chunk with parameters', function () {
    var chunkOne, chunkTwo;
    beforeEach(function (done) {
      chunkOne = new BaseChunk('one ');
      chunkTwo = new BaseChunk('two ');
      chunk = new ListChunk({
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
      chunk = new ListChunk();
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
        subChunk = new BaseChunk('foo ');
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
      xit('should have a size of 4', function (done) {
        expect(chunk.size).toBe(12);
        done();
      });
      xit('should have contents', function (done) {
        var expectedContents = new Buffer(12);
        expectedContents.write('LIST', 0, 4, 'ascii');
        expectedContents.writeUInt32BE(4, 4);
        expectedContents.write('foo ', 8, 4, 'ascii');
        expect(chunk.contents.length).toBe(8);
        _.forEach(chunk.contents, function (byte, i) {
          expect(byte).toBe(expectedContents[i]);
        });
        done();
      });
    });
  });
});

