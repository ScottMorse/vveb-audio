import * as StandardizedAudioContext from "standardized-audio-context"
import * as StandardizedAudioContextMock from "standardized-audio-context-mock" // this library should not be included in release builds

type WebAudioAPI =
  | typeof StandardizedAudioContext
  | typeof StandardizedAudioContextMock

/**
 * Resolves th Web Audio API.
 * This is normally the standardized-audio-context's API,
 * but it is replaced with a mock for testing
 */
export const WAPI: WebAudioAPI =
  process.env.NODE_ENV === "test"
    ? StandardizedAudioContextMock
    : StandardizedAudioContext
