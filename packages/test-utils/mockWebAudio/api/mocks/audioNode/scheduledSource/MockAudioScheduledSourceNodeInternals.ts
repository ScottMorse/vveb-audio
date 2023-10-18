import { MockEnvironment } from "@@test-utils/mockWebAudio/api/mockFactory"
import { sanitizeEventCallback } from "@@test-utils/mockWebAudio/util/events"
import { OmitEventTarget } from "@@test-utils/mockWebAudio/util/types"
import { MockAudioNodeInternals } from "../base/MockAudioNodeInternals"

export class MockAudioScheduledSourceNodeInternals
  extends MockAudioNodeInternals
  implements OmitEventTarget<AudioScheduledSourceNode>
{
  constructor(
    mock: AudioScheduledSourceNode,
    mockEnvironment: MockEnvironment,
    context: BaseAudioContext
  ) {
    super(mock, mockEnvironment, context)
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
