import { VirtualAudioGraphNode } from "./virtualAudioGraphNode"

export type NodeLookupMap = {
  [nodeId in string]?: VirtualAudioGraphNode
}
