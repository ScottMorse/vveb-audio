import { logger } from "@@core/logger"
import { createAudioContext } from "../audioContext"
import { AudioNodeName, createAudioNode } from "../audioNode"
import { CreatableAudioNodeName } from "../audioNode/createAudioNode"
import { AudioParamName } from "./audioParamTypes"

export type AudioParamDefaults<Name extends AudioNodeName> =
  AudioParamName<Name> extends never
    ? Record<never, AudioParam>
    : {
        [key in AudioParamName<Name>]: AudioParam
      }

const defaultCtx = createAudioContext("offline", {
  length: 1,
  sampleRate: 44100,
})

const DEFAULT_EMPTY_NAMES: AudioNodeName[] = [
  "audio",
  "audioScheduledSource",
  "audioDestination",
]

const cache: Partial<Record<AudioNodeName, AudioParamDefaults<AudioNodeName>>> =
  {}

export const discoverDefaultAudioParams = <Name extends CreatableAudioNodeName>(
  name: Name
): AudioParamDefaults<Name> => {
  if (cache[name]) {
    return cache[name] as AudioParamDefaults<Name>
  }
  if (DEFAULT_EMPTY_NAMES.includes(name)) {
    return {} as AudioParamDefaults<Name>
  }
  let instance: any
  if (name === "iirFilter") {
    instance = createAudioNode("iirFilter", defaultCtx, {
      feedback: [1],
      feedforward: [1],
    })
  } else if (name === "mediaStreamAudioDestination") {
    instance = createAudioNode(name as any, createAudioContext("main"), {})
  } else {
    instance = createAudioNode(name as any, defaultCtx, undefined as any)
  }

  instance?.disconnect()
  const defaults = {} as AudioParamDefaults<Name>
  for (const key in instance ?? {}) {
    if (instance[key] instanceof AudioParam) {
      ;(defaults as any)[key] = instance[key] as AudioParam
    }
  }
  cache[name] = defaults
  return defaults
}
