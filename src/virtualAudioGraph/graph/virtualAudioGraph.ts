import { nanoid } from "nanoid"
import { Logger } from "@/lib/logger"
import {
  AudioNodeKind,
  AudioNodeName,
  getCanAudioContextStartListener,
} from "@/nativeWebAudio"
import {
  CreateVirtualAudioContextOptions,
  virtualAudioContextUtil,
} from "../context"
import { VirtualAudioGraphContext } from "../context"
import {
  CreateRootOptions,
  IsVirtualAudioNodeOptions,
  virtualAudioNodeUtil,
  NarrowedVirtualAudioGraphNode,
  VirtualAudioGraphNode,
} from "../node"
import {
  NodeLookupMap,
  resolveNodes,
  VirtualAudioGraphNodeArg,
} from "./lookupMap"

const logger = new Logger({ contextName: "VirtualAudioGraph" })

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

  get isDestroyed() {
    return this._isDestroyed
  }

  render() {
    if (this._isDestroyed) {
      logger.warn(`Cannot render destroyed graph '${this.id}'`)
      return
    }
    if (!this._isRendered) {
      this._context.render()
      this.roots.forEach((rootNode) => rootNode.render())
      this._isRendered = true
      logger.info(`Rendered virtual audio graph '${this.id}'`)
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
    if (warn && !node) logger.warn(`Node ID '${nodeId}' in graph '${this.id}'`)
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

  destroy() {
    this.roots.forEach((root) => root.destroy())
    this.context.destroy()

    this._roots = []
    this.lookupMap = {}

    this._isDestroyed = true
    this._isRendered = false

    logger.info(`Destroyed virtual audio graph '${this.id}'`)
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

    logger.info(`Created virtual audio graph '${this.id}'`, { roots, context })

    if (autoRender) {
      setTimeout(() => this.autoRender())
    }
  }

  private autoRender() {
    const listener = getCanAudioContextStartListener()

    const render = () => {
      logger.debug(`Auto-rendering graph '${this.id}'`)
      this.render()
    }

    if (listener.canStart) {
      render()
    } else {
      listener.on("canStart", render)
    }
  }

  private deleteRoot(rootId: string) {
    this._roots.splice(
      this._roots.findIndex(({ id }) => id === rootId),
      1
    )
  }

  private _id: string
  private _roots: VirtualAudioGraphNode[] = []
  private _context: VirtualAudioGraphContext
  private _isRendered = false
  private lookupMap: NodeLookupMap = {}
  private _isDestroyed = false
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
    context || { kind: "main" },
    id,
    autoRender
  )
