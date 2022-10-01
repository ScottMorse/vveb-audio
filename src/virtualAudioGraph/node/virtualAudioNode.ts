import {
  AudioNodeClassOptions,
  AudioNodeKind,
  AudioNodeName,
  AudioNodeNameOfKind,
  AudioParamName,
} from "@/nativeWebAudio"
import { CreateVirtualAudioParamOptions, VirtualAudioParams } from "../param"

export type VirtualAudioInputConnection = "node" | "param"

export type VirtualAudioNodeInput<
  Name extends AudioNodeName = AudioNodeName,
  AllowNodeReference extends boolean = false
> = {
  node: AllowNodeReference extends true
    ? VirtualAudioNode | VirtualAudioNodeReference
    : VirtualAudioNode
  param?: AudioParamName<Name>
}

/** An interface representing an AudioNode abstractly */
export interface VirtualAudioNode<Name extends AudioNodeName = AudioNodeName> {
  id: string
  name: Name
  options: AudioNodeClassOptions<Name>
  params: VirtualAudioParams<Name>
  inputs: VirtualAudioNodeInput<Name>[]
}

export type VirtualAudioNodeOfKind<Kind extends AudioNodeKind> =
  VirtualAudioNode<AudioNodeNameOfKind<Kind>>

export type CreateVirtualAudioNodeParams<
  Name extends AudioNodeName = AudioNodeName
> = {
  [key in AudioParamName<Name>]?: CreateVirtualAudioParamOptions
}

export type CreateVirtualAudioNodeInput<
  Name extends AudioNodeName = AudioNodeName,
  AllowReferenceInput extends boolean = false
> = {
  node: AllowReferenceInput extends true
    ? CreateVirtualAudioNodeOptionsOrReference
    : CreateVirtualAudioNodeOptions
  param?: AudioParamName<Name>
}

export type CreateVirtualAudioNodeOptions<
  Name extends AudioNodeName = AudioNodeName,
  AllowReferenceInput extends boolean = false
> = {
  /** Provide an ID that will be used to reference the node (otherwise generated) */
  id?: string
  /** Reference to a specific AudioNode class */
  name: Name
  params?: CreateVirtualAudioNodeParams<Name>
  /** The args object passed to the AudioNode class's second parameter, if available */
  options?: AudioNodeClassOptions<Name>
  /** A list of virtual nodes to create. These cannot be destination nodes, as they have 0 outputs */
  inputs?: CreateVirtualAudioNodeInput<AudioNodeName, AllowReferenceInput>[]

  idRef?: never
}

export interface VirtualAudioNodeReference {
  idRef: string
}

export type CreateVirtualAudioNodeOptionsOrReference<
  Name extends AudioNodeName = AudioNodeName
> = CreateVirtualAudioNodeOptions<Name, true> | VirtualAudioNodeReference
