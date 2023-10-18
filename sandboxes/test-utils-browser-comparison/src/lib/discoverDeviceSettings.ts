import { DeeplyPartial } from "@@core/internal/util/types"
import {
  DeviceSettings,
  createDeviceSettings,
} from "@@test-utils/mockWebAudio/util/deviceSettings"

export const discoverDeviceSettings = async () => {
  const discoveredSettings: DeeplyPartial<DeviceSettings> = {}

  try {
    /** One....BILLION hertz */
    new OfflineAudioContext(1, 1, 1_000_000_000)
    console.warn("Device's max sample rate is greater than one billion?")
  } catch (error) {
    const match = (error as Error).message.match(/\[(\d+),\s+(\d+)\]/)
    if (match) {
      const [_, min, max] = match
      discoveredSettings.minSampleRate = Number(min)
      discoveredSettings.maxSampleRate = Number(max)
    } else {
      console.warn("Could not discover device sample rate min/max", error)
    }
  }

  const ctx = new AudioContext()

  discoveredSettings.destinationMaxChannelCount =
    ctx.destination.maxChannelCount

  discoveredSettings.audioContextBaseLatency = ctx.baseLatency
  discoveredSettings.audioContextOutputLatency = ctx.outputLatency

  try {
    new AudioBuffer({
      length: 1,
      sampleRate: 41500,
      numberOfChannels: 1_000_000,
    })
    console.warn("Device's max channels is greater than one million?")
  } catch (error) {
    const match = (error as Error).message.match(/\[1,\s*(\d+)\]/)
    if (match) {
      const [_, max] = match
      discoveredSettings.audioBufferMaxChannelCount = Number(max)
    } else {
      console.warn(
        "Could not discover device max audio buffer channel count",
        error
      )
    }
  }

  // Discover mediaTrackCapabilities and mediaTrackSettings using MediaStream APIs
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    })
    const audioTrack = stream.getAudioTracks()[0]

    if (!audioTrack) console.warn("No audio track found in stream")

    discoveredSettings.mediaTrackCapabilities = audioTrack.getCapabilities()
    discoveredSettings.mediaTrackSettings = audioTrack.getSettings()
  } catch (error) {
    console.error("Error discovering media devices:", error)
  }

  return {
    discoveredSettings,
    settings: createDeviceSettings(discoveredSettings),
  }
}
