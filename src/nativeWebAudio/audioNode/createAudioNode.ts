import { getAudioNodeConfig } from "./audioNodeConfig"
import {
  AudioNodeClassOptions,
  AudioNodeInstance,
  AudioNodeName,
} from "./audioNodeTypes"

/** Instantiate an AudioNode by its key name */
export const createAudioNode = <Name extends AudioNodeName>(
  name: Name,
  ctx: AudioContext,
  options: AudioNodeClassOptions<Name>
) => {
  const config = getAudioNodeConfig(name)
  if (!config) {
    throw new Error(`Unsupported AudioNode '${name}'`)
  }
  return new config.cls(ctx, options as any) as AudioNodeInstance<Name>
}
