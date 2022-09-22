import intersection from "lodash/intersection"
import { ALL_AUDIO_NODES } from "./audioNodes"
import {
  AudioNodeKind,
  AudioNodeName,
  AudioNodeNameOfKind,
} from "./audioNodeTypes"

/**
 * Lookup data about an AudioNode by its key name.
 * This gives you access to the class itself, as well as
 * the node kind (source, effect, or destination).
 */
export const getAudioNodeConfig = <Name extends AudioNodeName>(name: Name) => {
  const config = ALL_AUDIO_NODES[name]
  if (!config) console.warn(`Unsupported AudioNode '${name}'`)
  return config
}

export const isAudioNodeNameOfKind = <Kind extends AudioNodeKind>(
  name: AudioNodeName,
  ...kind: Kind[]
): name is AudioNodeNameOfKind<Kind> =>
  intersection(
    (getAudioNodeConfig(name)?.kind || []) as readonly AudioNodeKind[],
    kind
  ).length === kind.length
