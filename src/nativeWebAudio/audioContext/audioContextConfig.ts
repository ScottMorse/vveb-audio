import { logger } from "@/lib/logger"
import { ALL_AUDIO_CONTEXTS } from "./audioContexts"
import { AudioContextConfig, AudioContextName } from "./audioContextTypes"

export const getAudioContextConfig = <Name extends AudioContextName>(
  name: Name
): AudioContextConfig<Name> => {
  const config = ALL_AUDIO_CONTEXTS[name]
  if (!config) logger.warn(`Unsupported AudioContext '${name}'`)
  return config as any as AudioContextConfig<Name>
}

export const isAudioContextName = <Name extends AudioContextName>(
  name: string,
  ...names: AudioContextName[]
): name is Name => names.includes(name as any)
