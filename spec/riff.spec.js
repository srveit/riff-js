/**
 * @file Tests the RIFF class
 * @copyright Stephen R. Veit 2015
 */
'use strict';
var riff = require('../riff'),
  fs = require('fs'),
  _ = require('lodash'),
  path = require('path'),
  Q = require('q'),
  readFile = Q.nfbind(fs.readFile),
  fixtures = path.resolve('.', 'spec/fixtures');
describe('riff', function () {
  var chunk;
  describe('new chunk with parameters', function () {
    beforeEach(function (done) {
      chunk = riff.createChunkWithId({
        id: 'fmt ',
        formatTag: 1,
        channels: 1,
        samplesPerSecond: 8000,
        avgBytesPerSec: 8000,
        blockAlign: 1,
        bitsPerSample: 8
      });
      done();
    });
    it('should exist', function (done) {
      expect(chunk).not.toBeUndefined();
      done();
    });
    it('should have a id of "fmt "', function (done) {
      expect(chunk.id).toBe('fmt ');
      done();
    });
  });
  describe('createChunkFromBuffer with fmtChunk 16-bit PCM', function () {
    beforeEach(function (done) {
      var contents = new Buffer(24);
      contents.write('fmt ', 0, 4, 'ascii');
      contents.writeUInt32LE(16, 4);
      contents.writeUInt16LE(1, 8);
      contents.writeUInt16LE(1, 10);
      contents.writeUInt32LE(8000, 12);
      contents.writeUInt32LE(16000, 16);
      contents.writeUInt16LE(2, 20);
      contents.writeUInt16LE(16, 22);
      chunk = riff.createChunkFromBuffer({contents: contents});
      done();
    });

    it('should exist', function (done) {
      expect(chunk).not.toBeUndefined();
      done();
    });
    it('should have a id of "fmt "', function (done) {
      expect(chunk.id).toBe('fmt ');
      done();
    });
    it('should have a size of 16', function (done) {
      expect(chunk.size).toBe(16);
      done();
    });
    it('should have bufferLength', function (done) {
      expect(chunk.bufferLength).toBe(24);
      done();
    });
    it('should have a formatTag of 1', function (done) {
      expect(chunk.formatTag).toBe(1);
      done();
    });
    it('should have a channels of 1', function (done) {
      expect(chunk.channels).toBe(1);
      done();
    });
    it('should have a samplesPerSecond of 8000', function (done) {
      expect(chunk.samplesPerSecond).toBe(8000);
      done();
    });
    it('should have a avgBytesPerSec of 16000', function (done) {
      expect(chunk.avgBytesPerSec).toBe(16000);
      done();
    });
    it('should have a blockAlign of 2', function (done) {
      expect(chunk.blockAlign).toBe(2);
      done();
    });
    it('should have a bitsPerSample of 16', function (done) {
      expect(chunk.bitsPerSample).toBe(16);
      done();
    });
    it('should have a cbSize of 0', function (done) {
      expect(chunk.cbSize).toBe(0);
      done();
    });
  });
  describe('convertToUlaw', function () {
    var ulawFile, expectedUlawFile, setupFailed;
    beforeEach(function (done) {
      setupFailed = false;
      readFile(fixtures + '/sample2.wav')
        .then(function (pcmFileContents) {
          ulawFile = riff.convertToUlaw(pcmFileContents);
        })
        .then(function () {
          return readFile(fixtures + '/sample2u.wav');
        })
        .then(function (ulawFileContents) {
          expectedUlawFile =
            riff.createChunkFromBuffer({contents: ulawFileContents});
        })
        .catch(function (errors) {
          console.log('errors', errors);
          setupFailed = true;
        })
        .finally(done);
    });
    it('should read fixtures successfully', function (done) {
      expect(setupFailed).toBe(false);
      done();
    });
    it('should have pcmFile', function (done) {
      _.forEach(ulawFile.contents, function (byte, i) {
        expect(byte).toBe(expectedUlawFile.contents[i]);
      });
      done();
    });
  });
  describe('parseRiffFile', function () {
    var returnedError, parsedFile;
    beforeEach(function (done) {
      returnedError = undefined;
      parsedFile = undefined;
      done();
    });
    describe('with valid file', function () {
      beforeEach(function (done) {
        riff.parseRiffFile(fixtures + '/sample2.wav', function (err, file) {
          returnedError = err;
          parsedFile = file;
          done();
        });
      });
      it('should parse file successfully', function (done) {
        expect(returnedError).toBe(null);
        done();
      });
      it('should return parsed file', function (done) {
        expect(parsedFile.id).toBe('RIFF');
        done();
      });
    });
    describe('with invalid file', function () {
      beforeEach(function (done) {
        riff.parseRiffFile('does-not-exist', function (err, file) {
          returnedError = err;
          parsedFile = file;
          done();
        });
      });
      it('should return and error', function (done) {
        expect(returnedError).not.toBe(null);
        done();
      });
      it('should not return parsed file', function (done) {
        expect(parsedFile).toBeUndefined();
        done();
      });
    });
  });
});
