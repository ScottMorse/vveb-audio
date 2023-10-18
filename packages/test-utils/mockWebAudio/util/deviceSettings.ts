/**
 * Different browsers have different constraints on the number of channels and
 * sample rate of an AudioContext. This module provides a way to set these
 * constraints globally for the entire test suite.
 *
 * These settings are global since they affect the global Web Audio API.
 */
import { DeeplyPartial } from "@vveb-audio/core/internal/util/types"
import merge from "lodash/merge"
import round from "lodash/round"
import { createGroupId } from "./mediaStream"

export interface DeviceSettings {
  audioContextBaseLatency: number
  audioContextOutputLatency: number
  destinationMaxChannelCount: number
  audioBufferMaxChannelCount: number
  minSampleRate: number
  maxSampleRate: number
  maxFrameLength: number
  mediaTrackCapabilities: Omit<MediaTrackCapabilities, "deviceId">
  mediaTrackSettings: Omit<MediaTrackSettings, "deviceId">
}

const DEFAULT_GROUP_ID = createGroupId()

const DEFAULT_DEVICE_SETTINGS: DeviceSettings = {
  audioContextBaseLatency: 0.01,
  audioContextOutputLatency: 0.01,
  destinationMaxChannelCount: 2,
  audioBufferMaxChannelCount: 32,
  minSampleRate: 3_000,
  maxSampleRate: 768_000,
  maxFrameLength: 100_000_000,
  mediaTrackCapabilities: {
    aspectRatio: { max: 16, min: 4 },
    autoGainControl: [true, false],
    channelCount: { max: 2, min: 1 },
    displaySurface: "monitor",
    echoCancellation: [true, false],
    facingMode: ["user", "environment", "left", "right"],
    frameRate: { max: 60, min: 1 },
    groupId: DEFAULT_GROUP_ID,
    height: { max: 1080, min: 480 },
    noiseSuppression: [true, false],
    sampleRate: { max: 48000, min: 8000 },
    sampleSize: { max: 24, min: 8 },
    width: { max: 1920, min: 640 },
  },
  mediaTrackSettings: {
    width: 1280,
    height: 720,
    aspectRatio: 1.78,
    frameRate: 30,
    facingMode: "user",
    echoCancellation: true,
    autoGainControl: false,
    noiseSuppression: true,
    groupId: DEFAULT_GROUP_ID,
    sampleRate: 48000,
    sampleSize: 16,
  },
}

const validateDeviceSettings = (settings: DeviceSettings) => {
  if (settings.minSampleRate > settings.maxSampleRate) {
    throw new RangeError(
      `${ERROR_PREFIX}minSampleRate (${settings.minSampleRate}) must be less than or equal to maxSampleRate (${settings.maxSampleRate})`
    )
  }

  throwZeroOrNegativeError(
    "destinationMaxChannelCount",
    settings.destinationMaxChannelCount
  )
  throwZeroOrNegativeError("minSampleRate", settings.minSampleRate)
  throwZeroOrNegativeError("maxSampleRate", settings.maxSampleRate)

  return settings
}

export const createDeviceSettings = (
  settings?: DeeplyPartial<DeviceSettings>
): DeviceSettings =>
  validateDeviceSettings(merge({}, DEFAULT_DEVICE_SETTINGS, settings))

const ERROR_PREFIX =
  "[@@test-utils]: Error setting mock Web Audio API device settings: "

const throwZeroOrNegativeError = (key: keyof DeviceSettings, value: number) => {
  if (value <= 0) {
    throw new RangeError(
      `${ERROR_PREFIX}${key} (${value}) must be greater than 0`
    )
  }
}

export const formatSampleRate = (rate: number, roundInt?: boolean) => {
  const length = (roundInt ? round(rate) : rate).toFixed(0).length
  if (length > 6) {
    return round(rate, -(length - 6))
      .toExponential()
      .replace(/\.\d{4}e/g, (x) => x.slice(0, 5) + "0e")
  }
  return rate.toString()
}
