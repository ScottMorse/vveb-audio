import { logger } from "@/lib/logger"
import {
  AudioNodeInstance,
  AudioNodeName,
  AudioNodeNameOfKind,
  createAudioNode,
  isAudioNodeNameOfKind,
} from "@/nativeWebAudio"
import { VirtualAudioGraphNode } from "../graph"
import { VirtualAudioGraphContext } from "../graph/virtualAudioGraphContext"
import { DEFAULT_DESTINATION_ID } from "../node"

export class NodeRenderer<Name extends AudioNodeName> {
  get audioNode() {
    return this._audioNode
  }

  get isPlaying() {
    return this._isPlaying
  }

  render(forceRerender = false) {
    if (!this.shouldRerender(forceRerender)) return
    const existingNode = this._audioNode

    logger.debug(`Rendering node '${this.virtualNode.id}'`, { node: this })
    const audioNode = this.createAudioNode()

    if (existingNode) {
      this.cleanUpAudioNode()
      this.handleRerender(existingNode, audioNode)
    }

    this.connectInputs(audioNode)

    this._audioNode = audioNode

    return audioNode
  }

  start() {
    if (this.canPlay()) {
      logger.debug(`Starting node '${this.virtualNode.id}'`, { node: this })
      this._audioNode?.start()
      this._isPlaying = true
    }
  }

  /** Eagerly rerenders the AudioNode by default, unless `false` passed */
  stop(eagerRerender = true) {
    if (this.canPlay()) {
      logger.debug(`Stopping node '${this.virtualNode.id}'`, { node: this })
      this._audioNode?.stop()
      this._isPlaying = false
      if (eagerRerender) {
        this.render(true)
      } else {
        this.cleanUpAudioNode()
      }
    }
  }

  constructor(
    private virtualNode: VirtualAudioGraphNode<Name>,
    private context: VirtualAudioGraphContext
  ) {}

  private createAudioNode(): AudioNodeInstance<Name> {
    logger.debug(`Creating audio node '${this.virtualNode.id}'`, { node: this })
    const audioContext = this.context.audioContext as BaseAudioContext
    return this.virtualNode.id === DEFAULT_DESTINATION_ID
      ? (audioContext.destination as any)
      : createAudioNode(
          this.virtualNode.name,
          audioContext,
          this.virtualNode.options
        )
  }

  private handleRerender(
    existingAudioNode: AudioNode,
    newAudioNode: AudioNode
  ) {
    this.virtualNode.outputs.forEach((outputNode) => {
      if (!outputNode.audioNode) {
        outputNode.render()
      }
      logger.debug(
        `Reconnecting '${this.virtualNode.id}' to output node '${outputNode.id}'`,
        { node: this }
      )
      newAudioNode.connect(outputNode.audioNode as AudioNode)
    })
    this.virtualNode.inputs.forEach((inputNode) => {
      logger.debug(
        `Disconnecting input node '${inputNode.id}' from '${this.virtualNode.id}'`,
        { node: this }
      )
      inputNode.audioNode?.disconnect(existingAudioNode)
    })
  }

  private connectInputs(newAudioNode: AudioNode) {
    this.virtualNode.inputs.forEach((inputNode) => {
      if (!inputNode.audioNode) {
        inputNode.render()
      }
      logger.debug(
        `Connecting input node '${inputNode.id}' to '${this.virtualNode.id}'`,
        {
          id: this.virtualNode.id,
          inputNode,
          newAudioNode,
        }
      )
      inputNode.audioNode?.connect(newAudioNode)
    })
  }

  private shouldRerender(forceRerender: boolean) {
    if (!this.context.audioContext) {
      logger.warn(
        `Cannot render node '${this.virtualNode.id}' because the context has not been rendered`
      )
      return false
    }
    return forceRerender || !this._audioNode
  }

  private canPlay(): this is NodeRenderer<AudioNodeNameOfKind<"source">> {
    if (!isAudioNodeNameOfKind(this.virtualNode.name, "source")) {
      return this.warnCannotPlay(`it is not a source node`)
    }
    if (!this._audioNode) {
      this.render()
    } else if (
      typeof (this._audioNode as OscillatorNode).start !== "function"
    ) {
      return this.warnCannotPlay(`the AudioNode has no start method`)
    }
    return true
  }

  private warnCannotPlay(because: string) {
    logger.warn(`Cannot play node '${this.virtualNode.id}' because ${because}`)
    return false
  }

  private cleanUpAudioNode() {
    if (!this._audioNode) return
    logger.debug(`Cleaning up previous audio node '${this.virtualNode.id}'`, {
      node: this,
    })
    if (this._isPlaying) {
      this.stop(false)
    }
    this._audioNode.disconnect()
    this._audioNode = null
  }

  private _audioNode: AudioNodeInstance<Name> | null = null
  private _isPlaying = false
}
