import { logger } from "@/lib/logger"
import { AudioContextName } from "@/nativeWebAudio"
import { AudioContextRenderer } from "./audioContextRenderer"
import {
  DefinedAudioContextClassOptions,
  VirtualAudioContextOptionsUpdate,
  virtualAudioContextUtil,
  VirtualAudioContext,
} from "./virtualAudioContext"

export class VirtualAudioGraphContext<
  Name extends AudioContextName = AudioContextName
> {
  get id() {
    return this._id
  }

  get name() {
    return this._name
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

  updateOptions(options: VirtualAudioContextOptionsUpdate<Name>) {
    const updatedOptions = virtualAudioContextUtil.updateOptions(
      this._options,
      options
    )
    this._options = updatedOptions
    this.virtualContext.options = updatedOptions
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
    this._name = updatedContext.name as any
    this._options = updatedContext.options as any
    return this
  }

  destroy() {
    logger.warnNotImplemented()
  }

  constructor(private virtualContext: VirtualAudioContext<Name>) {
    this.virtualContext = virtualContext
    this._id = virtualContext.id
    this._name = virtualContext.name
    this._options = virtualContext.options || ({} as any)
    this.renderer = new AudioContextRenderer(this)
  }

  private _id: string
  private _name: Name
  private _options: DefinedAudioContextClassOptions<Name>

  private renderer: AudioContextRenderer

  private _isDestroyed = false
}
