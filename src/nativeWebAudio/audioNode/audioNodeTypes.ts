import { ArrayItem } from "@/lib/util/types"
import { ALL_AUDIO_NODES } from "./audioNodes"

type AllNodes = typeof ALL_AUDIO_NODES

export type AudioNodeName = keyof AllNodes

type AudioNodeMetadata<Name extends AudioNodeName = AudioNodeName> =
  AllNodes[Name]

export type AudioNodeClass<Name extends AudioNodeName = AudioNodeName> =
  AudioNodeMetadata<Name>["cls"]

export type AudioNodeKind<Name extends AudioNodeName = AudioNodeName> =
  ArrayItem<AudioNodeMetadata<Name>["kind"]>

type AudioNodeMetadataByKind<Kind extends AudioNodeKind = AudioNodeKind> = {
  [K in keyof AllNodes]: ArrayItem<AllNodes[K]["kind"]> extends Kind
    ? AllNodes[K] & { name: K }
    : never
}[keyof AllNodes]

export type AudioNodeNameByKind<Kind extends AudioNodeKind = AudioNodeKind> =
  AudioNodeMetadataByKind<Kind>["name"]

export type AudioNodeClassByKind<Kind extends AudioNodeKind = AudioNodeKind> =
  AudioNodeMetadataByKind<Kind>["cls"]

export type AudioNodeClassOptions<Name extends AudioNodeName = AudioNodeName> =
  ConstructorParameters<AudioNodeClass<Name>>[1] extends undefined
    ? undefined
    : ConstructorParameters<AudioNodeClass<Name>>[1]
