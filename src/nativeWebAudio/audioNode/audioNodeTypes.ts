import { ArrayItem } from "@/lib/util/types"
import { AudioParamName } from "../audioParam/audioParamTypes"
import { ALL_AUDIO_NODES } from "./audioNodes"

type AllNodes = typeof ALL_AUDIO_NODES

export type AudioNodeName = keyof AllNodes

type AudioNodeMetadata<Name extends AudioNodeName = AudioNodeName> =
  AllNodes[Name]

export type AudioNodeClass<Name extends AudioNodeName = AudioNodeName> =
  AudioNodeMetadata<Name>["cls"]

export type AudioNodeInstance<Name extends AudioNodeName = AudioNodeName> =
  InstanceType<AudioNodeClass<Name>>

export type AudioNodeKind<Name extends AudioNodeName = AudioNodeName> =
  ArrayItem<AudioNodeMetadata<Name>["kind"]>

type AudioNodeMetadataOfKind<Kind extends AudioNodeKind = AudioNodeKind> = {
  [K in keyof AllNodes]: Kind extends ArrayItem<AllNodes[K]["kind"]>
    ? AllNodes[K] & { name: K }
    : never
}[keyof AllNodes]

export type AudioNodeNameOfKind<Kind extends AudioNodeKind = AudioNodeKind> =
  AudioNodeMetadataOfKind<Kind>["name"]

export type AudioNodeClassOfKind<Kind extends AudioNodeKind = AudioNodeKind> =
  AudioNodeMetadataOfKind<Kind>["cls"]

export type AudioNodeInstanceOfKind<
  Kind extends AudioNodeKind = AudioNodeKind
> = InstanceType<AudioNodeClassOfKind<Kind>>

export type AudioNodeClassOptions<Name extends AudioNodeName = AudioNodeName> =
  ConstructorParameters<AudioNodeClass<Name>>[1] extends undefined
    ? undefined
    : ConstructorParameters<AudioNodeClass<Name>>[1]

export type AudioNodeClassOptionsOfKind<
  Kind extends AudioNodeKind = AudioNodeKind
> = AudioNodeClassOptions<AudioNodeNameOfKind<Kind>>

export type AudioNodeClassOptionsWithoutParams<
  Name extends AudioNodeName = AudioNodeName
> = Omit<AudioNodeClassOptions<Name>, AudioParamName<Name>>
