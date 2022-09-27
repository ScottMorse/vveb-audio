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
    if (!this.canRender(forceRerender)) return

    const audioNode = this.createAudioNode()

    if (this._audioNode) {
      this.handleRerender(this._audioNode, audioNode)
    }

    this.connectInputs(audioNode)

    this.cleanUpAudioNode()

    this._audioNode = audioNode

    return audioNode
  }

  start() {
    if (this.canPlay()) {
      this._audioNode?.start()
      this._isPlaying = true
    }
  }

  /** Eagerly rerenders the AudioNode by default, unless `false` passed */
  stop(eagerRerender = true) {
    if (this.canPlay()) {
      this._audioNode?.stop()
      this._isPlaying = false
      if (eagerRerender) {
        this.render(true)
      }
    }
  }

  constructor(
    private virtualNode: VirtualAudioGraphNode<Name>,
    private context: VirtualAudioGraphContext
  ) {}

  private createAudioNode(): AudioNodeInstance<Name> {
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
      newAudioNode.connect(outputNode.audioNode as AudioNode)
    })
    this.virtualNode.inputs.forEach((inputNode) => {
      inputNode.audioNode?.disconnect(existingAudioNode)
    })
  }

  private connectInputs(newAudioNode: AudioNode) {
    this.virtualNode.inputs.forEach((inputNode) => {
      if (!inputNode.audioNode) {
        inputNode.render()
      }
      inputNode.audioNode?.connect(newAudioNode)
    })
  }

  private canRender(forceRerender: boolean) {
    if (!this.context.audioContext) {
      console.warn(
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
    console.warn(`Cannot play node '${this.virtualNode.id}' because ${because}`)
    return false
  }

  private cleanUpAudioNode() {
    if (!this._audioNode) return
    if (this._isPlaying) {
      this.stop(false)
    }
    this._audioNode.disconnect()
    this._audioNode = null
  }

  private _audioNode: AudioNodeInstance<Name> | null = null
  private _isPlaying = false
}
