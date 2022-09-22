/**
 * WARNING: IMPORTING ANY NON-TYPES FROM VirtualAudioNode WILL CAUSE A CIRCULAR DEPENDENCY
 *
 * Current dependency cycle tolerated due to the fact that only TS types are cycled,
 * therefore not a danger to runtime.
 */
import { VirtualAudioNode } from "../virtualAudioNode"

export type VNodePath = number[]

export type VNodeLookupMetadata = {
  parentId: string
  node: VirtualAudioNode
  path: VNodePath
}

export type VNodeLookupMap<IsPartial extends boolean = false> =
  IsPartial extends true
    ? {
        [key in string]?: VNodeLookupMetadata
      }
    : {
        [key: string]: VNodeLookupMetadata
      }

export const getVNodeByPath = (
  root: VirtualAudioNode,
  path: VNodePath
): VirtualAudioNode | null => {
  if (path.length) {
    const [nextPath] = path
    const nextRoot = root.inputs[nextPath]
    return path.length === 1
      ? nextRoot
      : getVNodeByPath(nextRoot, path.slice(1))
  }
  return null
}
