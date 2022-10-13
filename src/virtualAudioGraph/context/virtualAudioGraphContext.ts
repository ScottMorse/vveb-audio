import { logger } from "@/lib/logger"
import { AudioContextName, CreateAudioContextKind } from "@/nativeWebAudio"
import { AudioContextRenderer } from "./audioContextRenderer"
import {
  DefinedAudioContextClassOptions,
  VirtualAudioContextOptionsUpdate,
  virtualAudioContextUtil,
  VirtualAudioContext,
} from "./virtualAudioContext"

export class VirtualAudioGraphContext<
  Kind extends CreateAudioContextKind = CreateAudioContextKind
> {
  get id() {
    return this._id
  }

  get kind() {
    return this._kind
  }

  get options() {
    return this._options
  }

  get audioContext() {
    return this.renderer.audioContext
  }

  get canStart() {
    return this.renderer.canStart
  }

  get isDestroyed() {
    return this._isDestroyed
  }

  render() {
    return this.renderer.render()
  }

  updateOptions(options: VirtualAudioContextOptionsUpdate<Kind>) {
    const updatedOptions = virtualAudioContextUtil.updateOptions(
      this._options,
      options
    )
    /** @todo dig into why typing got so awkward for these */
    this._options = updatedOptions as any
    this.virtualContext.options = updatedOptions as any
    return this
  }

  updateName<NewName extends AudioContextName = AudioContextName>(
    name: NewName,
    options?: DefinedAudioContextClassOptions<NewName>
  ) {
    const updatedContext = virtualAudioContextUtil.updateName(
      this.virtualContext,
      name,
      options
    )
    Object.assign(this.virtualContext, updatedContext)
    this._kind = updatedContext.kind as any
    this._options = updatedContext.options as any
    return this
  }

  destroy() {
    logger.warnNotImplemented()
  }

  constructor(private virtualContext: VirtualAudioContext<Kind>) {
    this.virtualContext = virtualContext
    this._id = virtualContext.id
    this._kind = virtualContext.kind
    this._options = (virtualContext.options as any) || ({} as any)
    this.renderer = new AudioContextRenderer(this)
  }

  private _id: string
  private _kind: Kind
  private _options: DefinedAudioContextClassOptions<Kind>

  private renderer: AudioContextRenderer

  private _isDestroyed = false
}
