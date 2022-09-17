import {
  AudioNodeClass,
  AudioNodeClassOptions,
  AudioNodeKeyName,
  AudioNodeKind,
  DefaultAudioNodeKindFromKeyName,
} from "./audioNode"
import { getAudioNodeConfig } from "./getAudioNodeConfig"

/** Instantiate an AudioNode by its key name */
export const createAudioNode = <
  K extends AudioNodeKeyName<Kind>,
  Kind extends AudioNodeKind = DefaultAudioNodeKindFromKeyName<K>
>(
  key: K,
  ctx: AudioContext,
  options?: AudioNodeClassOptions<K, Kind>
): InstanceType<AudioNodeClass<K, Kind>> => {
  return new (getAudioNodeConfig(key).cls)(ctx, options as any) as any
}
