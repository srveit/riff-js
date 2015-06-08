var riff = require('../riff/riff');

describe('riff', function () {
  describe('decodeRif', function () {
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
