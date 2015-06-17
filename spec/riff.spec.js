var riff = require('../riff');

describe('riff', function () {
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
