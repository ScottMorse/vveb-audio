import {
  AudioNodeInstance,
  AudioNodeKind,
  AudioNodeName,
  AudioNodeNameOfKind,
} from "@/nativeWebAudio/audioNode"

export type AudioParamName<Name extends AudioNodeName = AudioNodeName> = {
  [K in keyof AudioNodeInstance<Name>]: AudioNodeInstance<Name>[K] extends AudioParam
    ? K
    : never
}[keyof AudioNodeInstance<Name>]

export type AudioParamNameOfKind<Kind extends AudioNodeKind> = AudioParamName<
  AudioNodeNameOfKind<Kind>
>
