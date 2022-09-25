import { AudioNodeInstance, AudioNodeName } from "@/nativeWebAudio"
import { VirtualAudioGraphNode } from "../graph"
export class NodeRenderer<Name extends AudioNodeName> {
  get audioContext() {
    return this._audioContext
  }

  set audioContext(ctx: BaseAudioContext | null) {
    if (this.audioContext) {
    }
    this._audioContext = ctx
  }

  get node() {
    return
  }

  constructor(
    private vNode: VirtualAudioGraphNode,
    ctx: BaseAudioContext | null = null
  ) {
    this._audioContext = ctx
  }

  private _audioNode: AudioNodeInstance<Name> | null = null
  private _audioContext: BaseAudioContext | null
}
