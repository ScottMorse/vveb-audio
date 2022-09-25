import { AudioContextClassOptions, AudioContextName } from "@/nativeWebAudio"
import { VirtualAudioContext } from "../context"

export class VirtualAudioNodeContext<
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

  constructor(private virtualContext: VirtualAudioContext<Name>) {
    this.virtualContext = virtualContext
    this._id = virtualContext.id
    this._name = virtualContext.name
    this._options = virtualContext.options || ({} as any)
  }

  private _id: string
  private _name: Name
  private _options: Exclude<AudioContextClassOptions<Name>, undefined>
}
