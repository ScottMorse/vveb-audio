import { AUDIO_NODE_KEYS } from "../node"

/** @todo AudioWorklet, AudioWorkletProcessor AudioListener, AudioBuffer, and more? */

export abstract class BaseAudioContext {
  decodeAudioData(_audioData: ArrayBuffer): Promise<AudioBuffer> {
    return Promise.resolve(new AudioBuffer({ length: 1, sampleRate: 44100 }))
  }
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
