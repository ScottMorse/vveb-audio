import { AudioNodeName } from "@/nativeWebAudio"
import {
  CreateRootOptions,
  DEFAULT_DESTINATION_ID,
  isDefaultDestination,
  virtualAudioNodeUtil,
} from "../node"

/** WARNING: The following two imports are circular but imports are only used as types */
import { VirtualAudioGraph } from "./virtualAudioGraph"
import { VirtualAudioGraphNode } from "./virtualAudioGraphNode"

export type NodeLookupMap = {
  [nodeId in string]?: VirtualAudioGraphNode
}

export type VirtualAudioGraphNodeArg =
  | CreateRootOptions<AudioNodeName>
  | VirtualAudioGraphNode

export const resolveNodes = (
  nodes: VirtualAudioGraphNodeArg[],
  lookupMap: NodeLookupMap,
  graph: VirtualAudioGraph
) => {
  const ids: string[] = []
  const roots: VirtualAudioGraphNode[] = []
  for (const nodeOption of nodes) {
    const isDefaultDest = isDefaultDestination(nodeOption)
    if (nodeOption instanceof VirtualAudioGraphNode) {
      roots.push(nodeOption)
    } else if (virtualAudioNodeUtil.isReference(nodeOption)) {
      ids.push(nodeOption.idRef)
    } else if (isDefaultDest && lookupMap[DEFAULT_DESTINATION_ID]) {
      roots.push(lookupMap[DEFAULT_DESTINATION_ID])
    } else if (!isDefaultDest && nodeOption.id && lookupMap[nodeOption.id]) {
      console.warn(
        `Node ID '${nodeOption.id}' already exists in graph and will not be recreated. You can reference it with { idRef: "${nodeOption.id}" } instead.`
      )
    } else {
      const node = virtualAudioNodeUtil.createRoot(nodeOption)
      roots.push(new VirtualAudioGraphNode<any>(node, lookupMap, [], graph))
    }
  }

  for (const id of ids) {
    const node = lookupMap[id]
    if (node) {
      roots.push(node)
    } else {
      console.warn(`Node ID reference '${id}' not found in graph '${graph.id}'`)
    }
  }
  return roots
}
