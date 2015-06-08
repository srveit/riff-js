(function (module) {
  function Riff() {
  }

  function decodeRiff(fileContents) {
    return new Riff(fileContents);
  }

  module.exports = {
    decodeRiff: decodeRiff
  };
})(module);
