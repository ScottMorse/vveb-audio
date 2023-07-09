import { getInternals } from "@@test-utils/mockWebAudio/api/baseMock"
import { MockAudioNode } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNode"
import { MockMediaStreamAudioDestinationNodeInternals } from "./MockMediaStreamAudioDestinationNodeInternals"

export class MockMediaStreamAudioDestinationNode extends MockAudioNode<MockMediaStreamAudioDestinationNodeInternals> implements MediaStreamAudioDestinationNode {
  get stream() {
    return getInternals(this).stream
  }
}
