/**
 * @file Tests the audioConverter functions
 * @copyright Stephen R. Veit 2015
 */
'use strict';
var Q = require('q'),
  fs = require('fs'),
  path = require('path'),
  _ = require('lodash'),
  readFile = Q.nfbind(fs.readFile),
  riff = require('../riff'),
  audioConverter = require('../riff/audioConverter'),
  fixtures = path.resolve('.', 'spec/fixtures');

describe('audioConverter', function () {
  describe('with sample.wav', function () {
    var pcmFile, ulawFile, expectedUlawFile, setupFailed;
    beforeEach(function (done) {
      setupFailed = false;
      readFile(fixtures + '/sample.wav')
        .then(function (pcmFileContents) {
          pcmFile = riff.createChunkFromBuffer({contents: pcmFileContents});
        })
        .then(function () {
          return readFile(fixtures + '/sampleu.wav');
        })
        .then(function (ulawFileContents) {
          expectedUlawFile =
            riff.createChunkFromBuffer({contents: ulawFileContents});
        })
        .then(function () {
          ulawFile = audioConverter.toUlaw(pcmFile);
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
  describe('with file that has all possible sample values', function () {
    var pcmFile, ulawFile, expectedUlawFile, setupFailed;
    beforeEach(function (done) {
      setupFailed = false;
      readFile(fixtures + '/sample2.wav')
        .then(function (pcmFileContents) {
          pcmFile = riff.createChunkFromBuffer({contents: pcmFileContents});
        })
        .then(function () {
          return readFile(fixtures + '/sample2u.wav');
        })
        .then(function (ulawFileContents) {
          expectedUlawFile =
            riff.createChunkFromBuffer({contents: ulawFileContents});
        })
        .then(function () {
          ulawFile = audioConverter.toUlaw(pcmFile);
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
  describe('with a file converted by sox', function () {
    var pcmFile, ulawFile, expectedUlawFile, setupFailed;
    beforeEach(function (done) {
      setupFailed = false;
      readFile(fixtures + '/sample3.wav')
        .then(function (pcmFileContents) {
          pcmFile = riff.createChunkFromBuffer({contents: pcmFileContents});
        })
        .then(function () {
          return readFile(fixtures + '/sample3u.wav');
        })
        .then(function (ulawFileContents) {
          expectedUlawFile =
            riff.createChunkFromBuffer({contents: ulawFileContents});
        })
        .then(function () {
          ulawFile = audioConverter.toUlaw(pcmFile);
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
      var delta = 1;
      _.forEach(ulawFile.contents, function (byte, i) {
        var expectedByte = expectedUlawFile.contents[i];
        if (expectedByte === 126) {
          expect([125, 126, 127, 255]).toContain(byte);
        } else if (expectedByte === 255) {
          expect([126, 127, 255]).toContain(byte);
        } else {
          expect(byte).not.toBeLessThan(expectedByte - delta);
          expect(byte).not.toBeGreaterThan(expectedByte + delta);
        }
      });
      done();
    });
  });
});
