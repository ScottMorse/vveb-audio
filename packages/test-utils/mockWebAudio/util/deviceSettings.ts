/**
 * Different browsers have different constraints on the number of channels and
 * sample rate of an AudioContext. This module provides a way to set these
 * constraints globally for the entire test suite.
 *
 * These settings are global since they affect the global Web Audio API.
 */

import { createGroupId } from "./mediaStream"

export interface DeviceSettings {
  maxChannels: number
  minSampleRate: number
  maxSampleRate: number
  mediaTrackCapabilities: Omit<MediaTrackCapabilities, "deviceId">
  mediaTrackSettings: Omit<MediaTrackSettings, "deviceId">
}

const DEFAULT_GROUP_ID = createGroupId()

const DEFAULT_DEVICE_SETTINGS: DeviceSettings = {
  maxChannels: 32,
  minSampleRate: 3_000,
  maxSampleRate: 768_000,
  mediaTrackCapabilities: {
    aspectRatio: { max: 16, min: 4 },
    autoGainControl: [true, false],
    channelCount: { max: 2, min: 1 },
    cursor: ["always", "motion", "never"],
    displaySurface: "monitor",
    echoCancellation: [true, false],
    facingMode: ["user", "environment", "left", "right"],
    frameRate: { max: 60, min: 1 },
    groupId: DEFAULT_GROUP_ID,
    height: { max: 1080, min: 480 },
    latency: { max: 0.5, min: 0 },
    logicalSurface: true,
    noiseSuppression: [true, false],
    resizeMode: ["none", "crop-and-scale"],
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
    restrictOwnAudio: false,
  },
}

const GLOBAL_DEVICE_SETTINGS = {
  ...DEFAULT_DEVICE_SETTINGS,
}

export const createDeviceSettings = (
  settings?: Partial<DeviceSettings>
): DeviceSettings => ({
  ...DEFAULT_DEVICE_SETTINGS,
  ...settings,
})

const ERROR_PREFIX =
  "[@@test-utils]: Error setting mock Web Audio API device settings: "

const throwZeroOrNegativeError = (key: keyof DeviceSettings, value: number) => {
  if (value <= 0) {
    throw new RangeError(
      `${ERROR_PREFIX}${key} (${value}) must be greater than 0`
    )
  }
}

export const getGlobalDeviceSetting = <K extends keyof DeviceSettings>(
  key: K
): DeviceSettings[K] => GLOBAL_DEVICE_SETTINGS[key]

export const resetGlobalDeviceSettings = () =>
  Object.assign(GLOBAL_DEVICE_SETTINGS, DEFAULT_DEVICE_SETTINGS)

export interface SetGlobalDeviceSettingsOptions {
  resetOtherFields?: boolean
}

/** @todo review and improve, */
export const validateDeviceSettings = (settings: DeviceSettings) => {
  if (settings.minSampleRate > settings.maxSampleRate) {
    throw new RangeError(
      `${ERROR_PREFIX}minSampleRate (${GLOBAL_DEVICE_SETTINGS.minSampleRate}) must be less than or equal to maxSampleRate (${GLOBAL_DEVICE_SETTINGS.maxSampleRate})`
    )
  }

  throwZeroOrNegativeError("maxChannels", GLOBAL_DEVICE_SETTINGS.maxChannels)
  throwZeroOrNegativeError(
    "minSampleRate",
    GLOBAL_DEVICE_SETTINGS.minSampleRate
  )
  throwZeroOrNegativeError(
    "maxSampleRate",
    GLOBAL_DEVICE_SETTINGS.maxSampleRate
  )
}
