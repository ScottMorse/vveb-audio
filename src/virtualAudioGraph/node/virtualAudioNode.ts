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
    : VirtualAudioNodeOfKind<"effect" | "source">[]
}

export type VirtualAudioNodeOfKind<Kind extends AudioNodeKind> =
  VirtualAudioNode<AudioNodeNameOfKind<Kind>>

export type CreateVirtualAudioNodeInput<
  Name extends AudioNodeNameOfKind<"effect" | "source"> = AudioNodeNameOfKind<
    "effect" | "source"
  >
> = CreateVirtualAudioNodeOptionsOrReference<Name>

export type CreateVirtualAudioNodeOptions<
  Name extends AudioNodeName = AudioNodeName
> = {
  /** Provide an ID that will be used to reference the node (otherwise generated) */
  id?: string
  /** Reference to a specific AudioNode class */
  name: Name
  /** The args object passed to the AudioNode class's second parameter, if available */
  options?: AudioNodeClassOptions<Name>
  /** A list of virtual nodes to create. These cannot be destination nodes, as they have 0 outputs */
  inputs?: Name extends AudioNodeNameOfKind<"source">
    ? []
    : CreateVirtualAudioNodeInput[]

  idRef?: never
}

export interface VirtualAudioNodeReference {
  idRef: string
}

export type CreateVirtualAudioNodeOptionsOrReference<
  Name extends AudioNodeName = AudioNodeName
> = CreateVirtualAudioNodeOptions<Name> | VirtualAudioNodeReference
