import {
  AudioNodeClassOptions,
  AudioNodeKind,
  AudioNodeName,
  AudioNodeNameOfKind,
} from "@/nativeWebAudio"

/** An interface representing an AudioNode abstractly */
export interface VirtualAudioNode<
  Name extends AudioNodeName = AudioNodeName,
  IsRoot extends boolean = boolean
> {
  id: string
  name: Name
  options: AudioNodeClassOptions<Name>
  isRoot: IsRoot
  destination?: IsRoot extends true
    ? VirtualAudioNodeOfKind<"destination", false>
    : undefined
  inputs: Name extends AudioNodeNameOfKind<"source">
    ? []
    : VirtualAudioNodeOfKind<"effect" | "source", false>[]
}

export type VirtualAudioNodeOfKind<
  Kind extends AudioNodeKind,
  IsRoot extends boolean = boolean
> = VirtualAudioNode<AudioNodeNameOfKind<Kind>, IsRoot>

export interface CreateVirtualAudioNodeRootOptions<
  Name extends AudioNodeName = AudioNodeName,
  IsRoot extends boolean = boolean
> {
  /** Reference to a specific AudioNode class */
  name: Name
  destination?: IsRoot extends true
    ? CreateVirtualAudioNodeRootOptions<
        AudioNodeNameOfKind<"destination">,
        false
      >
    : never
  /** The args object passed to the AudioNode class's second parameter, if available */
  options?: AudioNodeClassOptions<Name>
  /** A list of virtual nodes to create. These cannot be destination nodes, as they have 0 outputs */
  inputs?: Name extends AudioNodeNameOfKind<"effect" | "destination">
    ? CreateVirtualAudioNodeRootOptions<
        AudioNodeNameOfKind<"effect" | "source">,
        false
      >[]
    : undefined
}
