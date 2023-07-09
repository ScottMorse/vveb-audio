import { getInternals } from "@@test-utils/mockWebAudio/api/baseMock"
import { MockAudioNode } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNode"
import { MockMediaElementAudioSourceNodeInternals } from "./MockMediaElementAudioSourceNodeInternals"

export class MockMediaElementAudioSourceNode extends MockAudioNode<MockMediaElementAudioSourceNodeInternals> implements MediaElementAudioSourceNode {
  constructor(context: BaseAudioContext, options: MediaElementAudioSourceOptions) {
    super(context, options, new MockMediaElementAudioSourceNodeInternals(context, options))
  }

  get mediaElement() {
    return getInternals(this).mediaElement
  }
}
