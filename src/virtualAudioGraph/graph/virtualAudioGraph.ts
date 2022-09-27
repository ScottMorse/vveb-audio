import { nanoid } from "nanoid"
import { logger } from "@/lib/logger"
import {
  AudioNodeKind,
  AudioNodeName,
  getCanAudioContextStartListener,
} from "@/nativeWebAudio"
import {
  CreateVirtualAudioContextOptions,
  virtualAudioContextUtil,
} from "../context"
import {
  CreateRootOptions,
  IsVirtualAudioNodeOptions,
  virtualAudioNodeUtil,
} from "../node"
import {
  NodeLookupMap,
  resolveNodes,
  VirtualAudioGraphNodeArg,
} from "./lookupMap"
import { VirtualAudioGraphContext } from "./virtualAudioGraphContext"
import {
  NarrowedVirtualAudioGraphNode,
  VirtualAudioGraphNode,
} from "./virtualAudioGraphNode"

export class VirtualAudioGraph {
  get id() {
    return this._id
  }

  get roots() {
    return this._roots
  }

  get context() {
    return this._context
  }

  get isRendered() {
    return this._isRendered
  }

  render() {
    if (this._context.canRender && !this._isRendered) {
      this._context.render()
      this.roots.forEach((rootNode) => rootNode.render())
      this._isRendered = true
      logger.info(`Rendered virtual audio graph '${this.id}'`)
    } else if (!this._context.canRender) {
      logger.warn(
        new Error(
          `Cannot render virtual audio graph '${this.id}' until user has interacted with the page`
        )
      )
    }
  }

  getNodes<
    Name extends AudioNodeName = AudioNodeName,
    Kind extends AudioNodeKind = AudioNodeKind
  >(
    filter?: IsVirtualAudioNodeOptions<Name, Kind>
  ): NarrowedVirtualAudioGraphNode<Name, Kind>[] {
    const nodes = Object.values(this.lookupMap)
    return filter
      ? nodes.filter((node) => virtualAudioNodeUtil.isNode(node, filter))
      : (nodes as any)
  }

  getNode<
    ExpectedName extends AudioNodeName = AudioNodeName,
    ExpectedKind extends AudioNodeKind = AudioNodeKind
  >(nodeId: string, warn = false) {
    const node = this.lookupMap[nodeId]
    if (warn && !node)
      logger.warn(
        `Node ID '${nodeId}' in graph '${this.id}'`
      ) /** @todo verbosity-configurable logger */
    return (
      (node as NarrowedVirtualAudioGraphNode<ExpectedName, ExpectedKind>) ||
      null
    )
  }

  deleteNode(nodeId: string, warn = false) {
    const node = this.getNode(nodeId, warn)
    if (node?.destroy() && this.roots.includes(node)) {
      this.deleteRoot(nodeId)
    }
  }

  constructor(
    roots: VirtualAudioGraphNodeArg[],
    context: CreateVirtualAudioContextOptions,
    id?: string,
    autoRender?: boolean
  ) {
    this._id = id || nanoid()
    this._context = new VirtualAudioGraphContext(
      virtualAudioContextUtil.create(context)
    )
    this._roots = resolveNodes(roots, this.lookupMap, this, this._context)

    if (autoRender) {
      this.autoRender()
    }

    logger.info(`Created virtual audio graph '${this.id}'`, { roots, context })
  }

  private deleteRoot(rootId: string) {
    this._roots.splice(
      this._roots.findIndex(({ id }) => id === rootId),
      1
    )
  }

  private autoRender() {
    const listener = getCanAudioContextStartListener()
    const doIt = () => {
      logger.debug(`Auto-rendering virtual audio graph '${this.id}'`)
      this.render()
    }
    if (listener.canStart) {
      doIt()
    } else {
      listener.on("canStart", doIt)
    }
  }

  private _id: string
  private _roots: VirtualAudioGraphNode[] = []
  private _context: VirtualAudioGraphContext
  private _isRendered = false
  private lookupMap: NodeLookupMap = {}
}

export type CreateVirtualAudioGraphOptions = {
  root: CreateRootOptions<AudioNodeName> | CreateRootOptions<AudioNodeName>[]
  context?: CreateVirtualAudioContextOptions
  id?: string
  autoRender?: boolean
}

export const createVirtualAudioGraph = ({
  root,
  context,
  id,
  autoRender = false,
}: CreateVirtualAudioGraphOptions) =>
  new VirtualAudioGraph(
    Array.isArray(root) ? root : [root],
    context || { name: "default" },
    id,
    autoRender
  )
