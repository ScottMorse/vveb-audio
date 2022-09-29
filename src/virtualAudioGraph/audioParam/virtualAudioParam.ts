import { PartiallyRequired } from "@/lib/util/types"
import {
  AudioNodeName,
  AudioParamName,
  discoverDefaultAudioParamValues,
} from "@/nativeWebAudio"

export interface VirtualAudioParam {
  value: number
  defaultValue: number
  minValue: number
  maxValue: number
  automationRate: AutomationRate
}

export type VirtualAudioParams<Name extends AudioNodeName> = {
  [key in AudioParamName<Name>]: VirtualAudioParam
}

export type CreateVirtualAudioParamOptions = Partial<VirtualAudioParam> & {
  nodeName: AudioNodeName
  name: AudioParamName
}

export const DEFAULT_AUTOMATION_RATE = "a-rate" as const

const createVirtualAudioParam = (
  options: CreateVirtualAudioParamOptions
): VirtualAudioParam => {
  const defaultValue = discoverDefaultAudioParamValues(options.nodeName)[
    options.name
  ] as number

  const resolveValue = (key: keyof typeof options) => {
    const value = options[key]
    return typeof value === "number" ? value : defaultValue
  }

  return {
    value: resolveValue("value"),
    defaultValue: resolveValue("defaultValue"),
    minValue: resolveValue("minValue"),
    maxValue: resolveValue("maxValue"),
    automationRate: options.automationRate ?? DEFAULT_AUTOMATION_RATE,
  }
}

const isVirtualAudioParam = (value: any): value is VirtualAudioParam =>
  typeof value === "object" &&
  typeof value.nodeId === "string" &&
  typeof value.value === "number" &&
  typeof value.defaultValue === "number" &&
  typeof value.minValue === "number" &&
  typeof value.maxValue === "number" &&
  typeof value.automationRate === "string"

export const virtualAudioParamUtil = {
  create: createVirtualAudioParam,
  isParam: isVirtualAudioParam,
}
