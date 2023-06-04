import { ConstructorNameToString } from "../../../internal/util/decorators"
import { NativeOfflineAudioCompletionEvent } from "../../../internal/util/nativeTypes"

@ConstructorNameToString
export class OfflineAudioCompletionEvent
  extends Event
  implements NativeOfflineAudioCompletionEvent
{
  constructor(type: string, options: { renderedBuffer: AudioBuffer }) {
    super(type)
    this._renderedBuffer = options.renderedBuffer
  }

  get renderedBuffer(): AudioBuffer {
    return this._renderedBuffer
  }

  private _renderedBuffer: AudioBuffer
}
