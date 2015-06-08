var riff = require('../riff/riff');

describe('riff', function () {
  describe('BaseChunk', function () {
    var chunk;
    describe('with no parameters', function () {
      beforeEach(function (done) {
        chunk = new riff.BaseChunk();
        done();
      });
      it('should return a chunk', function (done) {
        expect(chunk).not.toBeUndefined();
        done();
      });
      it('should have a type of "    "', function (done) {
        expect(chunk.type).toBe('    ');
        done();
      });
      it('should have a size of 0', function (done) {
        expect(chunk.size).toBe(0);
        done();
      });
      it('should have no content', function (done) {
        expect(chunk.contents).toBe('');
        done();
      });
    });
  });
  describe('decodeRiff', function () {
    var file;
    beforeEach(function (done) {
      file = riff.decodeRiff('RIFF');
      done();
    });
    it('should decode file', function (done) {
      expect(file).not.toBeUndefined();
      done();
    });
  });
});
