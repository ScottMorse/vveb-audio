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
) =>
  new (getAudioNodeConfig(name).cls)(
    ctx,
    options as any
  ) as AudioNodeInstance<Name>
