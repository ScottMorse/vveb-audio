import { getInternals } from "@@test-utils/mockWebAudio/api/baseMock"
import { MockAudioNode } from "../base/MockAudioNode"
import { MockAudioScheduledSourceNodeInternals } from "./MockAudioScheduledSourceNodeInternals"

export class MockAudioScheduledSourceNode<
    I extends MockAudioScheduledSourceNodeInternals
  >
  extends MockAudioNode<I>
  implements AudioScheduledSourceNode
{
  constructor(context: BaseAudioContext, _internals?: I) {
    super(
      context,
      undefined,
      _internals ?? (new MockAudioScheduledSourceNodeInternals(context) as I)
    )
  }

  get onended() {
    return getInternals(this).onended
  }

  set onended(value) {
    getInternals(this).onended = value
  }

  start(when?: number) {
    getInternals(this).start(when)
  }

  stop(when?: number) {
    getInternals(this).stop(when)
  }
}
