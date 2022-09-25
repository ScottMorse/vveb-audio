import {
  createAudioContext,
  getCanAudioContextStartListener,
} from "@/nativeWebAudio"
import { VirtualAudioGraphContext } from "../graph/virtualAudioGraphContext"

export class ContextRenderer {
  get canRender() {
    return this._canRender
  }

  get audioContext() {
    return this._audioContext
  }

  render() {
    if (this.canRender) {
      this._audioContext = createAudioContext(
        this.virtualContext.name,
        this.virtualContext.options
      )
    } else {
      console.warn(
        `Cannot render audio context until user has interacted with the page`
      )
    }
    return this._audioContext
  }

  constructor(private virtualContext: VirtualAudioGraphContext) {
    if (!this._canRender) {
      this.canStartListener.on("canStart", () => {
        this._canRender = true
      })
    }
  }

  private _audioContext: BaseAudioContext | null = null
  private canStartListener = getCanAudioContextStartListener()
  private _canRender = this.canStartListener.canStart
}
