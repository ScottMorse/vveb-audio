import { formatSampleRate } from "@@test-utils/mockWebAudio/util/deviceSettings"
import {
  convertSigned32Int,
  convertUnsigned32Int,
} from "@@test-utils/mockWebAudio/util/number"
import { MockEnvironment } from "../../mockFactory/createMockFactory"
import { MockInternals } from "../../mockFactory/mockInternals"

const throwIfUndefined = (value: any, name: string): void => {
  if (value === undefined) {
    throw new TypeError(
      `Failed to construct 'AudioBuffer': Failed to read the '${name}' property from 'AudioBufferOptions': Required member is undefined.`
    )
  }
}

const validateChannelNumber = (
  channelNumber: number,
  method: string,
  numberOfChannels: number
) => {
  channelNumber =
    method === "getChannelData"
      ? convertUnsigned32Int(channelNumber)
      : convertSigned32Int(channelNumber)

  if (channelNumber < 0 || channelNumber >= numberOfChannels) {
    const floored = Math.floor(channelNumber)
    throw new DOMException(
      // we all love the consistency of JS APIs
      method === "getChannelData"
        ? `Failed to execute 'getChannelData' on 'AudioBuffer': channel index (${floored}) exceeds number of channels (${numberOfChannels})`
        : `Failed to execute '${method}' on 'AudioBuffer': The channelNumber provided (${floored}) is outside the range [0, ${
            numberOfChannels - 1
          }].`,
      "IndexSizeError"
    )
  }
  return channelNumber
}

export class MockAudioBufferInternals extends MockInternals<AudioBuffer> {
  constructor(
    mock: AudioBuffer,
    mockEnvironment: MockEnvironment,
    options: AudioBufferOptions
  ) {
    super(mock, mockEnvironment)

    options = this.validateOptions(options)

    this._length = options.length
    this._sampleRate = options.sampleRate
    this._duration = this._length / this._sampleRate
    this._numberOfChannels = options.numberOfChannels ?? 1

    try {
      this._channelsData = new Array(this.numberOfChannels)
        .fill(null)
        .map(() => new Float32Array(this.length))
    } catch (e) {
      throw new DOMException(
        `Failed to construct 'AudioBuffer': createBuffer(${this.numberOfChannels}, ${this.length}, ${this.sampleRate}) failed.`,
        "NotSupportedError"
      )
    }
  }

  copyFromChannel(
    destination: Float32Array,
    channelNumber: number,
    _bufferOffset = 0
  ): void {
    if (arguments.length < 2) {
      throw new TypeError(
        `Failed to execute 'copyFromChannel' on 'AudioBuffer': 2 arguments required, but only ${arguments.length} present.`
      )
    }

    if (!(destination instanceof Float32Array)) {
      throw new TypeError(
        "Failed to execute 'copyFromChannel' on 'AudioBuffer': parameter 1 is not of type 'Float32Array'."
      )
    }

    validateChannelNumber(
      channelNumber,
      "copyFromChannel",
      this.numberOfChannels
    )
  }

  copyToChannel(
    source: Float32Array,
    channelNumber: number,
    _bufferOffset = 0
  ): void {
    if (arguments.length < 2) {
      throw new TypeError(
        `Failed to execute 'copyToChannel' on 'AudioBuffer': 2 arguments required, but only ${arguments.length} present.`
      )
    }

    if (!(source instanceof Float32Array)) {
      throw new TypeError(
        "Failed to execute 'copyToChannel' on 'AudioBuffer': parameter 1 is not of type 'Float32Array'."
      )
    }

    validateChannelNumber(channelNumber, "copyToChannel", this.numberOfChannels)
  }

  get duration(): number {
    return this._duration
  }

  getChannelData(channelNumber: number): Float32Array {
    if (arguments.length < 1) {
      throw new TypeError(
        `Failed to execute 'getChannelData' on 'AudioBuffer': 1 argument required, but only ${arguments.length} present.`
      )
    }

    channelNumber = validateChannelNumber(
      channelNumber,
      "getChannelData",
      this.numberOfChannels
    )

    return this._channelsData[channelNumber]
  }

  get length(): number {
    return this._length
  }

  get numberOfChannels(): number {
    return this._numberOfChannels
  }

  get sampleRate(): number {
    return this._sampleRate
  }

  private validateOptions(options: AudioBufferOptions): AudioBufferOptions {
    if (options === undefined) {
      throw new TypeError(
        "Failed to construct 'AudioBuffer': 1 argument required, but only 0 present."
      )
    }
    if (typeof options !== "object" || options === null) {
      throw new TypeError(
        "Failed to construct 'AudioBuffer': The provided value is not of type 'AudioBufferOptions'."
      )
    }

    const newOptions = { ...options }

    throwIfUndefined(options.length, "length")
    newOptions.length = Math.floor(convertUnsigned32Int(options.length))

    if (this._length >= this.mockEnvironment.deviceSettings.maxFrameLength) {
      throw new DOMException(
        `Failed to construct 'AudioBuffer': createBuffer(${this._numberOfChannels}, ${this._length}, ${this._sampleRate}) failed.`,
        "NotSupportedError"
      )
    }

    if (!(newOptions.length > 0)) {
      throw new DOMException(
        "Failed to construct 'AudioBuffer': The number of frames provided (0) is less than or equal to the minimum bound (0).",
        "NotSupportedError"
      )
    }

    throwIfUndefined(options.sampleRate, "sampleRate")
    newOptions.sampleRate = Number(options.sampleRate)
    if (!isFinite(newOptions.sampleRate)) {
      throw new TypeError(
        "Failed to construct 'AudioBuffer': Failed to read the 'sampleRate' property from 'AudioBufferOptions': The provided float value is non-finite."
      )
    }
    if (
      !(
        newOptions.sampleRate >=
          this.mockEnvironment.deviceSettings.minSampleRate &&
        newOptions.sampleRate <=
          this.mockEnvironment.deviceSettings.maxSampleRate
      )
    ) {
      throw new DOMException(
        `Failed to construct 'AudioBuffer': The sample rate provided (${formatSampleRate(
          newOptions.sampleRate,
          newOptions.sampleRate >
            this.mockEnvironment.deviceSettings.maxSampleRate
        )}) is outside the range [${
          this.mockEnvironment.deviceSettings.minSampleRate
        }, ${this.mockEnvironment.deviceSettings.maxSampleRate}].`,
        "NotSupportedError"
      )
    }

    newOptions.numberOfChannels =
      options.numberOfChannels === undefined
        ? 1
        : Math.floor(convertUnsigned32Int(options.numberOfChannels))
    if (
      !(
        newOptions.numberOfChannels > 0 &&
        newOptions.numberOfChannels <=
          this.mockEnvironment.deviceSettings.audioBufferMaxChannelCount
      )
    ) {
      throw new DOMException(
        `Failed to construct 'AudioBuffer': The number of channels provided (${newOptions.numberOfChannels}) is outside the range [1, ${this.mockEnvironment.deviceSettings.audioBufferMaxChannelCount}].`,
        "NotSupportedError"
      )
    }

    return newOptions
  }

  protected _length: number

  protected _sampleRate: number

  protected _duration: number

  protected _numberOfChannels: number

  private _channelsData: Float32Array[]
}
