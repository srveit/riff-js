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
  fit('should read fixtures successfully', function (done) {
    expect(setupFailed).toBe(false);
    done();
  });
  fit('should have pcmFile', function (done) {
    console.log(pcmFile.description());
    console.log(ulawFile.description());
    console.log(expectedUlawFile.description());
    _.forEach(ulawFile.contents, function (byte, i) {
      expect(byte).toBe(expectedUlawFile.contents[i]);
    });
    done();
  });
});
