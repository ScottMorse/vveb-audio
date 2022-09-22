import {
  AudioNodeClassOptions,
  AudioNodeKind,
  AudioNodeName,
  AudioNodeNameOfKind,
} from "@/nativeWebAudio"

/** An interface representing an AudioNode abstractly */
export interface VirtualAudioNode<Name extends AudioNodeName = AudioNodeName> {
  id: string
  name: Name
  options: AudioNodeClassOptions<Name>
  inputs: Name extends AudioNodeNameOfKind<"source">
    ? []
    : VirtualAudioNode<AudioNodeNameOfKind<"effect" | "source">>[]
}

export type VirtualAudioNodeOfKind<Kind extends AudioNodeKind> =
  VirtualAudioNode<AudioNodeNameOfKind<Kind>>

export interface CreateVirtualAudioNodeRootOptions<
  Name extends AudioNodeName = AudioNodeName
> {
  /** Reference to a specific AudioNode class */
  name: Name
  /** The args object passed to the AudioNode class's second parameter, if available */
  options?: AudioNodeClassOptions<Name>
  /** A list of virtual nodes to create. These cannot be destination nodes, as they have 0 outputs */
  inputs?: Name extends AudioNodeNameOfKind<"effect" | "destination">
    ? CreateVirtualAudioNodeRootOptions<
        AudioNodeNameOfKind<"effect" | "source">
      >[]
    : undefined
}
