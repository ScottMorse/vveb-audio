import { AUDIO_NODE_KEYS } from "../audioNode"

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

/** Dynamically add the AudioNode constructor methods such as createGain */
for (const key of AUDIO_NODE_KEYS) {
  BaseAudioContext.prototype[`create${key.replace(/Node$/g, "")}`] = function (
    options?: any
  ) {
    return new window[key](this, options)
  }
}
