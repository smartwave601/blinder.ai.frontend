var lamejs = require("./lame.all");

function audioBufferToMP3(aBuffer) {
  let numOfChan = aBuffer.numberOfChannels,
    btwLength = aBuffer.length * numOfChan * 2 + 44,
    btwArrBuff = new ArrayBuffer(btwLength),
    btwView = new DataView(btwArrBuff),
    btwChnls = [],
    btwIndex,
    btwSample,
    btwOffset = 0,
    btwPos = 0;
  setUint32(0x46464952); // "RIFF"
  setUint32(btwLength - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"
  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(aBuffer.sampleRate);
  setUint32(aBuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2); // block-align
  setUint16(16); // 16-bit
  setUint32(0x61746164); // "data" - chunk
  setUint32(btwLength - btwPos - 4); // chunk length

  function wavToMp3(channels, sampleRate, left, right = null) {
    var buffer = [];
    var mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 128);
    var remaining = left.length;
    var samplesPerFrame = 1152;

    for (var i = 0; remaining >= samplesPerFrame; i += samplesPerFrame) {
      if (!right) {
        var mono = left.subarray(i, i + samplesPerFrame);
        var mp3buf = mp3enc.encodeBuffer(mono);
      } else {
        var leftChunk = left.subarray(i, i + samplesPerFrame);
        var rightChunk = right.subarray(i, i + samplesPerFrame);
        var mp3buf = mp3enc.encodeBuffer(leftChunk, rightChunk);
      }
      if (mp3buf.length > 0) {
        buffer.push(mp3buf); //new Int8Array(mp3buf));
      }
      remaining -= samplesPerFrame;
    }
    var d = mp3enc.flush();
    if (d.length > 0) {
      buffer.push(new Int8Array(d));
    }

    return new Blob(buffer, { type: "audio/mp3" });
  }

  function setUint16(data) {
    btwView.setUint16(btwPos, data, true);
    btwPos += 2;
  }

  function setUint32(data) {
    btwView.setUint32(btwPos, data, true);
    btwPos += 4;
  }

  for (btwIndex = 0; btwIndex < aBuffer.numberOfChannels; btwIndex++)
    btwChnls.push(aBuffer.getChannelData(btwIndex));

  while (btwPos < btwLength) {
    for (btwIndex = 0; btwIndex < numOfChan; btwIndex++) {
      // interleave btwChnls
      btwSample = Math.max(-1, Math.min(1, btwChnls[btwIndex][btwOffset])); // clamp
      btwSample = (0.5 + btwSample < 0 ? btwSample * 32768 : btwSample * 32767) | 0; // scale to 16-bit signed int
      btwView.setInt16(btwPos, btwSample, true); // write 16-bit sample
      btwPos += 2;
    }
    btwOffset++; // next source sample
  }

  let wavHdr = lamejs.WavHeader.readHeader(new DataView(btwArrBuff));

  //Stereo
  let data = new Int16Array(btwArrBuff, wavHdr.dataOffset, wavHdr.dataLen / 2);
  let leftData = [];
  let rightData = [];
  for (let i = 0; i < data.length; i += 2) {
    leftData.push(data[i]);
    rightData.push(data[i + 1]);
  }
  var left = new Int16Array(leftData);
  var right = new Int16Array(rightData);

  //STEREO
  if (wavHdr.channels === 2)
    return wavToMp3(
      wavHdr.channels,
      wavHdr.sampleRate,
      left,
      right,
    );
  //MONO
  return wavToMp3(wavHdr.channels, wavHdr.sampleRate, data);
  // return new Blob([btwArrBuff], { type: "audio/wav" });
}


export const convertToMP3V2 = (blob, callback) => {
  const audioContext = new AudioContext();
  const fileReader = new FileReader();

  // Set up file reader on loaded end event
  fileReader.onloadend = () => {
    const arrayBuffer = fileReader.result; // as ArrayBuffer;

    // Convert array buffer into audio buffer
    audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
      // Do something with audioBuffer
      callback(audioBufferToMP3(audioBuffer));
    });
  };

  //Load blob
  fileReader.readAsArrayBuffer(blob);
}