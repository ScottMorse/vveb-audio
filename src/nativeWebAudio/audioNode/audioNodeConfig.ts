import intersection from "lodash/intersection"
import { logger } from "@/lib/logger"
import { ALL_AUDIO_NODES } from "./audioNodes"
import {
  AudioNodeClass,
  AudioNodeKind,
  AudioNodeName,
  AudioNodeNameOfKind,
} from "./audioNodeTypes"

export type AudioNodeConfig<Name extends AudioNodeName = AudioNodeName> = {
  cls: AudioNodeClass<Name>
  kind: AudioNodeKind<Name>[]
}

const FALLBACK_NODE_CONFIG = ALL_AUDIO_NODES.audio

/**
 * Lookup data about an AudioNode by its key name.
 * This gives you access to the class itself, as well as
 * the node kind (source, effect, or destination).
 */
export const getAudioNodeConfig = <Name extends AudioNodeName>(
  name: Name,
  logError = true
): AudioNodeConfig<Name> => {
  const config = ALL_AUDIO_NODES[name]
  if (!config && logError)
    logger.warn(
      `Unsupported AudioNode '${name}' (Falls back to plain AudioNode)`
    )
  return (config as any as AudioNodeConfig<Name>) || FALLBACK_NODE_CONFIG
}

export const isAudioNodeNameOfKind = <Kind extends AudioNodeKind>(
  name: AudioNodeName,
  ...kind: Kind[]
): name is AudioNodeNameOfKind<Kind> =>
  intersection(
    (getAudioNodeConfig(name)?.kind || []) as readonly AudioNodeKind[],
    kind
  ).length === kind.length
