import { logger } from "@/lib/logger"
import { AudioNodeName } from "@/nativeWebAudio"
import {
  CreateRootOptions,
  DEFAULT_DESTINATION_ID,
  isDefaultDestinationOptions,
  virtualAudioNodeUtil,
} from "../node"

/** WARNING: The following two imports are circular but imports are only used as types */
import { VirtualAudioGraph } from "./virtualAudioGraph"
import { VirtualAudioGraphContext } from "./virtualAudioGraphContext"
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
  graph: VirtualAudioGraph,
  context: VirtualAudioGraphContext
) => {
  const ids: string[] = []
  const roots: VirtualAudioGraphNode[] = []
  for (const nodeOption of nodes) {
    const isDefaultDest = isDefaultDestinationOptions(nodeOption)
    if (nodeOption instanceof VirtualAudioGraphNode) {
      roots.push(nodeOption)
    } else if (virtualAudioNodeUtil.isReference(nodeOption)) {
      ids.push(nodeOption.idRef)
    } else if (isDefaultDest && lookupMap[DEFAULT_DESTINATION_ID]) {
      roots.push(lookupMap[DEFAULT_DESTINATION_ID])
    } else if (!isDefaultDest && nodeOption.id && lookupMap[nodeOption.id]) {
      logger.warn(
        `Node ID '${nodeOption.id}' already exists in graph and will not be recreated. You can reference it with { idRef: "${nodeOption.id}" } instead.`
      )
    } else {
      const node = virtualAudioNodeUtil.createRoot(nodeOption)
      roots.push(
        new VirtualAudioGraphNode<any>(node, lookupMap, [], graph, context)
      )
    }
  }

  for (const id of ids) {
    const node = lookupMap[id]
    if (node) {
      roots.push(node)
    } else {
      logger.warn(`Node ID reference '${id}' not found in graph '${graph.id}'`)
    }
  }
  return roots
}
