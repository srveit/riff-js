var ListChunk = require('../riff/ListChunk'),
    util = require('util'),
    _ = require('lodash');

describe('riff', function () {
  describe('ListChunk', function () {
    var chunk;
    describe('with no parameters', function () {
      beforeEach(function (done) {
        chunk = new ListChunk();
        done();
      });
      it('should return a chunk', function (done) {
        expect(chunk).not.toBeUndefined();
        done();
      });
    });
  });
});
