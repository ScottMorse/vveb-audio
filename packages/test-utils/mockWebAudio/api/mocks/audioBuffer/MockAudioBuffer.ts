import {
  ValidateClassArgsLength,
  ValidateMethodArgsLength,
} from "@@test-utils/mockWebAudio/util/arguments"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { createMockFactory } from "../../mockFactory"
import { MockAudioBufferInternals } from "./MockAudioBufferInternals"

export const createAudioBufferMock = createMockFactory<
  typeof AudioBuffer,
  MockAudioBufferInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @ValidateClassArgsLength(1)
  @MockConstructorName("AudioBuffer")
  class MockAudioBuffer implements AudioBuffer {
    constructor(options: AudioBufferOptions) {
      setInternals(
        this,
        new MockAudioBufferInternals(this, mockEnvironment, options)
      )
    }

    @ValidateMethodArgsLength(2)
    copyFromChannel(
      destination: Float32Array,
      channelNumber: number,
      startInChannel?: number
    ) {
      return getInternals(this).copyFromChannel(
        destination,
        channelNumber,
        startInChannel
      )
    }

    @ValidateMethodArgsLength(2)
    copyToChannel(
      source: Float32Array,
      channelNumber: number,
      startInChannel?: number
    ) {
      return getInternals(this).copyToChannel(
        source,
        channelNumber,
        startInChannel
      )
    }

    get duration(): number {
      return getInternals(this).duration
    }

    @ValidateMethodArgsLength(1)
    getChannelData(channel: number): Float32Array {
      return getInternals(this).getChannelData(channel)
    }

    get length(): number {
      return getInternals(this).length
    }

    get numberOfChannels(): number {
      return getInternals(this).numberOfChannels
    }

    get sampleRate(): number {
      return getInternals(this).sampleRate
    }
  }

  return MockAudioBuffer
})
