import { getGlobalDeviceSetting } from "../../../internal/util/deviceSettings"
import { NativeAudioBuffer } from "../../../internal/util/nativeTypes"
import { flipInt } from "../../../internal/util/number"

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
    typeof channelNumber === "number" && isFinite(channelNumber)
      ? method === "getChannelData"
        ? flipInt(channelNumber)
        : channelNumber
      : 0

  if (channelNumber < 0 || channelNumber >= numberOfChannels) {
    throw new DOMException(
      // we all love the consistency of JS APIs
      method === "getChannelData"
        ? `Failed to execute 'getChannelData' on 'AudioBuffer': channel index (${channelNumber}) exceeds number of channels (${numberOfChannels})`
        : `Failed to execute '${method}' on 'AudioBuffer': The channelNumber provided (${channelNumber}) is outside the range [0, ${
            numberOfChannels - 1
          }].`,
      "IndexSizeError"
    )
  }
  return channelNumber
}

const validateOptions = (options: AudioBufferOptions): AudioBufferOptions => {
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
  newOptions.length = Math.floor(flipInt(options.length))
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
      newOptions.sampleRate > getGlobalDeviceSetting("minSampleRate") &&
      newOptions.sampleRate < getGlobalDeviceSetting("maxSampleRate")
    )
  ) {
    throw new DOMException(
      `Failed to construct 'AudioBuffer': The sample rate provided (${
        newOptions.sampleRate
      }) is outside the range [${getGlobalDeviceSetting(
        "minSampleRate"
      )}, ${getGlobalDeviceSetting("maxSampleRate")}].`,
      "NotSupportedError"
    )
  }

  newOptions.numberOfChannels =
    options.numberOfChannels === undefined
      ? 1
      : Math.floor(flipInt(options.numberOfChannels))
  if (
    !(
      newOptions.numberOfChannels > 0 &&
      newOptions.numberOfChannels <= getGlobalDeviceSetting("maxChannels")
    )
  ) {
    throw new DOMException(
      `Failed to construct 'AudioBuffer': The number of channels provided (${
        newOptions.numberOfChannels
      }) is outside the range [1, ${getGlobalDeviceSetting("maxChannels")}].`,
      "NotSupportedError"
    )
  }

  return newOptions
}

export class AudioBuffer implements NativeAudioBuffer {
  constructor(options: AudioBufferOptions) {
    options = validateOptions(options)

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
    startInChannel = 0
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

    channelNumber = validateChannelNumber(
      channelNumber,
      "copyFromChannel",
      this.numberOfChannels
    )
    const source = this.getChannelData(channelNumber)
    for (let i = 0; i < destination.length; i++) {
      destination[i] = source[startInChannel + i] || 0
    }
  }

  copyToChannel(
    source: Float32Array,
    channelNumber: number,
    startInChannel = 0
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

    channelNumber = validateChannelNumber(
      channelNumber,
      "copyToChannel",
      this.numberOfChannels
    )
    const destination = this.getChannelData(channelNumber)
    for (let i = 0; i < source.length; i++) {
      destination[startInChannel + i] = source[i]
    }
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

  protected _length: number

  protected _sampleRate: number

  protected _duration: number

  protected _numberOfChannels: number

  private _channelsData: Float32Array[]
}
