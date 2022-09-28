import { PartiallyRequired } from "@/lib/util/types"
import { AudioNodeName, AudioParamName } from "@/nativeWebAudio"

export interface VirtualAudioParam {
  nodeId: string
  value: number
  defaultValue: number
  minValue: number
  maxValue: number
  automationRate: AutomationRate
}

export type VirtualAudioParams<Name extends AudioNodeName> = {
  [key in AudioParamName<Name>]: VirtualAudioParam
}

export type CreateVirtualAudioParamOptions = PartiallyRequired<
  Partial<VirtualAudioParam>,
  "nodeId"
>

export const DEFAULT_AUTOMATION_RATE = "a-rate" as const

const createVirtualAudioParam = (
  options: CreateVirtualAudioParamOptions
): VirtualAudioParam => {
  let defaultValue = 0
  for (const key of [
    "defaultValue",
    "value",
    "minValue",
    "maxValue",
  ] as const) {
    const value = options[key]
    if (typeof value === "number") {
      defaultValue = value
      break
    }
  }

  const resolveValue = (key: keyof typeof options) => {
    const value = options[key]
    return typeof value === "number" ? value : defaultValue
  }

  return {
    nodeId: options.nodeId,
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
