'use strict';

var chunk = require('./chunk'),
  fmtChunk = require('./fmtChunk'),
  factChunk = require('./factChunk'),
  riffForm = require('./riffForm'),
  ulawFormatTag = 7,
  exponentLookup = [
    0, 0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3,
    4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
    5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
    6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
    6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
    6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
    6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7
  ];

/* From C code written by
 *
 ** Craig Reese: IDA/Supercomputing Research Center
 ** Joe Campbell: Department of Defense
 ** 29 September 1989
 */
function linear2ulaw(sample) {
  var sign, exponent, mantissa, ulawbyte,
    bias = 0x84,   /* define the add-in bias for 16 bit samples */
    clip = 32635;

  /*jslint bitwise: true */
  /* Get the sample into sign-magnitude. */
  sign = (sample >> 8) & 0x80;               /* set aside the sign */
  if (sign !== 0) {
    sample = -sample;           /* get magnitude */
  }
  if (sample > clip) {
    sample = clip;          /* clip the magnitude */
  }
  /* Convert from 16 bit linear to ulaw. */
  sample = sample + bias;
  exponent = exponentLookup[(sample >> 7) & 0xFF];
  mantissa = (sample >> (exponent + 3)) & 0x0F;
  ulawbyte = ~(sign | (exponent << 4) | mantissa);
  ulawbyte = 256 + ulawbyte;
  /*jslint bitwise: false */
  return ulawbyte;
}

function toUlaw(pcmFile) {
  var pcmFmt = pcmFile.chunkWithId('fmt '),
    pcmData = pcmFile.chunkWithId('data'),
    pcmAudio = pcmData.data,
    ulawFmt = fmtChunk.createFmtChunk({
      formatTag: ulawFormatTag,
      channels: pcmFmt.channels,
      samplesPerSecond: pcmFmt.samplesPerSecond,
      avgBytesPerSec: pcmFmt.samplesPerSecond,
      blockAlign: 1,
      bitsPerSample: 8
    }),
    ulawFact = factChunk.createFactChunk({fileSize: pcmData.size / 2}),
    ulawData,
    ulawAudio = new Buffer(ulawFact.fileSize),
    i = ulawFact.fileSize;

  while (i > 0) {
    i -= 1;
    ulawAudio[i] = linear2ulaw(pcmAudio.readInt16LE(i * 2));
  }

  ulawData = chunk.createChunk({
    id: 'data',
    data: ulawAudio
  });
  return riffForm.createRiffForm({
    formType: 'WAVE',
    chunks: [ulawFmt, ulawFact, ulawData]
  });
}

exports.toUlaw = toUlaw;
