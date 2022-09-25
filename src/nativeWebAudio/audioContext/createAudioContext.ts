import { getAudioContextConfig } from "./audioContextConfig"
import {
  AudioContextClassOptions,
  AudioContextInstance,
  AudioContextName,
} from "./audioContextTypes"

export const createAudioContext = <Name extends AudioContextName>(
  context: Name,
  ...[options]: AudioContextClassOptions<Name> extends undefined
    ? [never]
    : [AudioContextClassOptions<Name>]
): AudioContextInstance<Name> => {
  const config = getAudioContextConfig(context)
  if (!config) {
    throw new Error(`Unsupported AudioContext '${context}'`)
  }
  return new config.cls(options as any) as any
}
