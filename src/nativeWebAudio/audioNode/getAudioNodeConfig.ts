import { ALL_AUDIO_NODES } from "./audioNodes"
import { AudioNodeName } from "./audioNodeTypes"

/**
 * Lookup data about an AudioNode by its key name.
 * This gives you access to the class itself, as well as
 * the node kind (source, effect, or destination).
 */
export const getAudioNodeConfig = <Name extends AudioNodeName>(name: Name) =>
  ALL_AUDIO_NODES[name]
