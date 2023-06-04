import { getAudioNodeConfig } from "./audioNodeConfig"
import { CREATABLE_AUDIO_NODES } from "./audioNodes"
import { AudioNodeClassOptions, AudioNodeInstance } from "./audioNodeTypes"

export type CreatableAudioNodeName = keyof typeof CREATABLE_AUDIO_NODES

/** Instantiate an AudioNode by its key name */
export const createAudioNode = <Name extends CreatableAudioNodeName>(
  name: Name,
  ctx: BaseAudioContext,
  ...[options]: AudioNodeClassOptions<Name> extends undefined
    ? []
    : [options: AudioNodeClassOptions<Name>]
) => {
  const config = getAudioNodeConfig(name)
  if (!config) {
    throw new Error(`Unsupported AudioNode '${name}'`)
  }
  return new config.cls(
    ctx as AudioContext,
    options as any
  ) as AudioNodeInstance<Name>
}
