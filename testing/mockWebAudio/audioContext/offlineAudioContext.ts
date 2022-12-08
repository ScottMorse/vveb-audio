import { BaseAudioContext } from "./baseAudioContext"

export class OfflineAudioContext extends BaseAudioContext {
  constructor(_numberOfChannels: number, _length: number, _sampleRate: number) {
    super()
  }

  startRendering(): Promise<AudioBuffer> {
    return Promise.resolve(new AudioBuffer({ length: 1, sampleRate: 44100 }))
  }
}
