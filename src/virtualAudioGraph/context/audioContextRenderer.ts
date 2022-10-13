import { Logger } from "@/lib/logger"
import {
  createAudioContext,
  getCanAudioContextStartListener,
} from "@/nativeWebAudio"
import { VirtualAudioGraphContext } from "./virtualAudioGraphContext"

const logger = new Logger({ contextName: "AudioContextRenderer" })

export class AudioContextRenderer {
  get canStart() {
    return this._canStart
  }

  get audioContext() {
    return this._audioContext
  }

  render() {
    logger.debug(`Rendering context '${this.virtualContext.id}'`)
    this._audioContext = createAudioContext(
      this.virtualContext.kind,
      this.virtualContext.options as any
    )
    logger.debug(`Created audio context '${this.virtualContext.id}'`)
    return this._audioContext
  }

  constructor(private virtualContext: VirtualAudioGraphContext) {
    if (!this._canStart) {
      this.canStartListener.on("canStart", () => {
        this._canStart = true
      })
    }
  }

  private _audioContext: BaseAudioContext | null = null
  private canStartListener = getCanAudioContextStartListener()
  private _canStart = this.canStartListener.canStart
}
