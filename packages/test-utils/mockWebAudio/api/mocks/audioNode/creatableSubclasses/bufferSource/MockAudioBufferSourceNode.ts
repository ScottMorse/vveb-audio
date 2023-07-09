import { getInternals } from "@@test-utils/mockWebAudio/api/baseMock"
import { MockAudioScheduledSourceNode } from "../../scheduledSource"
import { MockAudioBufferSourceNodeInternals } from "./MockAudioBufferSourceNodeInternals"

export class MockAudioBufferSourceNode
  extends MockAudioScheduledSourceNode<MockAudioBufferSourceNodeInternals>
  implements AudioBufferSourceNode
{
  constructor(context: BaseAudioContext) {
    super(context, new MockAudioBufferSourceNodeInternals(context))
  }

  get buffer() {
    return getInternals(this).buffer
  }

  get detune() {
    return getInternals(this).detune
  }

  get loop() {
    return getInternals(this).loop
  }

  get loopEnd() {
    return getInternals(this).loopEnd
  }

  get loopStart() {
    return getInternals(this).loopStart
  }

  get onended() {
    return getInternals(this).onended
  }

  set onended(value) {
    getInternals(this).onended = value
  }

  get playbackRate() {
    return getInternals(this).playbackRate
  }

  start(when?: number, offset?: number, duration?: number) {
    return getInternals(this).start(when, offset, duration)
  }

  stop(when?: number) {
    return getInternals(this).stop(when)
  }
}
