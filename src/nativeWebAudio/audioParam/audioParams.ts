import { logger } from "@/lib/logger"
import { AudioNodeName } from "../audioNode"
import { ALL_AUDIO_NODES } from "../audioNode/audioNodes"
import { AudioParamName } from "./audioParamTypes"

export type AllAudioParams = {
  [K in AudioNodeName]: AudioParamName<K>[]
}

export const ALL_AUDIO_PARAM_NAMES = Object.entries(ALL_AUDIO_NODES).reduce(
  (paramNameMap, [nodeName, node]) => {
    paramNameMap[nodeName as AudioNodeName] = Object.entries(node).reduce(
      (paramNames, [paramName, param]) => {
        if (param instanceof AudioParam) {
          paramNames.push(paramName as AudioParamName)
        }
        return paramNames
      },
      [] as AudioParamName[]
    ) as any

    return paramNameMap
  },
  {} as AllAudioParams
)

export const getAudioParamNames = <Name extends AudioNodeName>(
  name: Name,
  logError = true
) => {
  const names = ALL_AUDIO_PARAM_NAMES[name]
  if (!names && logError) {
    logger.error(new Error(`Audio node name '${name}' is not supported`))
  }
  return names || []
}
