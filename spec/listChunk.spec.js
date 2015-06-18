var BaseChunk = require('../riff/baseChunk'),
    ListChunk = require('../riff/ListChunk'),
    util = require('util'),
    _ = require('lodash');

describe('ListChunk', function () {
  var chunk;
  describe('new chunk with no parameters', function () {
    beforeEach(function (done) {
      chunk = new ListChunk();
      done();
    });
    it('should exist', function (done) {
      expect(chunk).not.toBeUndefined();
      done();
    });
    it('should have chunkByType', function (done) {
      expect(chunk.chunkByType('foo ')).toBeUndefined();
      done();
    });
    it('should have a length', function (done) {
      expect(chunk.length).toBe(0);
      done();
    });
    it('should have a type of "LIST"', function (done) {
      expect(chunk.type).toBe('LIST');
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
      var expectedContents = new Buffer(8);
      expectedContents.write('LIST', 0, 4, 'ascii');
      expectedContents.writeUInt32BE(4, 4);
      expectedContents.write('    ', 8, 4, 'ascii');
      expect(chunk.contents.length).toBe(8);
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
      it('should have chunkByType', function (done) {
        expect(chunk.chunkByType('foo ')).toBe(subChunk);
        done();
      });
      it('should have chunks', function (done) {
        expect(chunk.chunks).toEqual([subChunk]);
        done();
      });
      it('should have a size of 4', function (done) {
        expect(chunk.size).toBe(12);
        done();
      });
      xit('should have contents', function (done) {
        var expectedContents = new Buffer(8);
        expectedContents.writeUInt32BE(0x20202020, 0);
        expectedContents.writeUInt32BE(0, 4);
        expect(chunk.contents.length).toBe(8);
        _.forEach(chunk.contents, function (byte, i) {
          expect(byte).toBe(expectedContents[i]);
        });
        done();
      });
    });
  });
});

