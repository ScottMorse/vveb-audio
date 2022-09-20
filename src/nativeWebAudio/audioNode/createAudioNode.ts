import { AudioNodeClassOptions, AudioNodeName } from "./audioNodeTypes"
import { getAudioNodeConfig } from "./getAudioNodeConfig"

/** Instantiate an AudioNode by its key name */
export const createAudioNode = <Name extends AudioNodeName>(
  name: Name,
  ctx: AudioContext,
  options: AudioNodeClassOptions<Name>
) => new (getAudioNodeConfig(name).cls)(ctx, options as any)
