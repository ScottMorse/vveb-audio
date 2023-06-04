import { Worklet, __ALLOWED } from "./Worklet"

export class AudioWorklet extends Worklet {
  constructor(_allowed: typeof __ALLOWED) {
    super(_allowed)
  }
}

export const createMockAudioWorklet = () => new AudioWorklet(__ALLOWED)
