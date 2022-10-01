import { AudioNodeName, createAudioNode } from "../audioNode"
import { AudioParamName } from "./audioParamTypes"

export type AudioParamDefaults<Name extends AudioNodeName> = {
  [key in AudioParamName<Name>]: AudioParam
}

const defaultCtx = new OfflineAudioContext({ length: 1, sampleRate: 44100 })

export const discoverDefaultAudioParams = <Name extends AudioNodeName>(
  name: Name
): AudioParamDefaults<Name> => {
  if (name === "audio-destination") {
    return {} as AudioParamDefaults<Name>
  }
  const instance = createAudioNode(name, defaultCtx, {} as any)
  const defaults = {} as AudioParamDefaults<Name>
  for (const key in instance) {
    if (instance[key as keyof typeof instance] instanceof AudioParam) {
      defaults[key as any as keyof typeof defaults] = instance[
        key
      ] as AudioParam
    }
  }
  return defaults
}
