import { getInternals } from "@@test-utils/mockWebAudio/api/baseMock"
import { MockAudioNode } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNode"
import { MockMediaStreamAudioSourceNodeInternals } from "./MockMediaStreamAudioSourceNodeInternals"

export class MockMediaStreamAudioSourceNode extends MockAudioNode<MockMediaStreamAudioSourceNodeInternals> implements MediaStreamAudioSourceNode {
  constructor(context: BaseAudioContext, options: { mediaStream: MediaStream }) {
    super(context, options, new MockMediaStreamAudioSourceNodeInternals(context, options))
  }

  get mediaStream() {
    return getInternals(this).mediaStream
  }
}
