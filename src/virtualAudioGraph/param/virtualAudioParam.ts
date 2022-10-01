import {
  AudioNodeName,
  AudioParamName,
  discoverDefaultAudioParams,
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

export type CreateVirtualAudioParamOptions = Partial<
  Pick<VirtualAudioParam, "value" | "automationRate">
> & {
  nodeName: AudioNodeName
  name: AudioParamName
}

const createVirtualAudioParam = (
  options: CreateVirtualAudioParamOptions
): VirtualAudioParam => {
  const defaultParam = discoverDefaultAudioParams(options.nodeName)[
    options.name
  ] as AudioParam

  if (typeof options.value === "number") {
    defaultParam.value = options.value
  }
  if (typeof options.automationRate === "string") {
    defaultParam.automationRate = options.automationRate
  }

  return {
    value: defaultParam.value,
    defaultValue: defaultParam.defaultValue,
    minValue: defaultParam.minValue,
    maxValue: defaultParam.maxValue,
    automationRate: defaultParam.automationRate,
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
