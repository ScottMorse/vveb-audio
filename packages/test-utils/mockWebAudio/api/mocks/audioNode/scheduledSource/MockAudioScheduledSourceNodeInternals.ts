import { sanitizeEventCallback } from "@@test-utils/mockWebAudio/util/events"
import { MockAudioNodeInternals } from "../base/MockAudioNodeInternals"

export class MockAudioScheduledSourceNodeInternals
  extends MockAudioNodeInternals
  implements AudioScheduledSourceNode
{
  constructor(context: BaseAudioContext) {
    super(context)
  }

  get onended() {
    return this._onended
  }

  set onended(value) {
    this._onended = sanitizeEventCallback(value)
  }

  start(_when?: number) {}

  stop(_when?: number) {}

  protected _onended: ((this: any, ev: Event) => any) | null = null
}
