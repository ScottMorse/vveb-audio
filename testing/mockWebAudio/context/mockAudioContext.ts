import { AUDIO_NODE_KEYS } from "../node"

/** @todo AudioWorkletProcessor AudioListener, AudioBuffer, and more? */

export abstract class BaseAudioContext {
  constructor() {
    setInterval(() => {
      this.currentTime += 0.01
    }, 10)
  }

  decodeAudioData(_audioData: ArrayBuffer): Promise<AudioBuffer> {
    return Promise.resolve(new AudioBuffer({ length: 1, sampleRate: 44100 }))
  }

  audioWorklet = new AudioWorklet()
  currentTime = 0
  destination = new AudioDestinationNode()
  listener = new AudioListener()
  sampleRate = 44100
}

for (const key of AUDIO_NODE_KEYS) {
  BaseAudioContext.prototype[`create${key.replace(/Node$/g, "")}`] = function (
    options?: any
  ) {
    return new window[key](this, options)
  }
}

export class AudioContext extends BaseAudioContext {}

export class OfflineAudioContext extends BaseAudioContext {}
