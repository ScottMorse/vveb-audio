import { MockAudioWorklet } from "./AudioWorklet";
import { MockWorklet } from "./Worklet";

export const createAudioWorkletMock = () => ({
  AudioWorklet: MockAudioWorklet,
  Worklet: MockWorklet
})
