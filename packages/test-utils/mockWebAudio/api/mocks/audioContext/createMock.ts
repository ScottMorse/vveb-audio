import { MockBaseAudioContext } from "./base"
import { MockAudioContext } from "./live"
import {
  MockOfflineAudioCompletionEvent,
  MockOfflineAudioContext,
} from "./offline"

export const createAudioContextMock = () => ({
  BaseAudioContext: MockBaseAudioContext,
  AudioContext: MockAudioContext,
  OfflineAudioContext: MockOfflineAudioContext,
  OfflineAudioCompletionEvent: MockOfflineAudioCompletionEvent,
})
