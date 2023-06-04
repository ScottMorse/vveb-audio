import { strict as assert } from "assert"
import { Mock } from "../../lib/mock"
import { compareErrors } from "../../lib/util"
import { RuntimeTest } from "../runtimeTest"

const CONTEXT = new OfflineAudioContext({
  length: 1,
  sampleRate: 44100,
  numberOfChannels: 2,
})
const MOCK_CONTEXT = new Mock.OfflineAudioContext({
  length: 1,
  sampleRate: 44100,
  numberOfChannels: 2,
})

const createTestingPair = () => ({
  param: CONTEXT.createBiquadFilter().detune,
  mockParam: MOCK_CONTEXT.createBiquadFilter().detune,
})

export const AUDIO_PARAM_TESTS: RuntimeTest[] = [
  {
    name: "",
    test: async () => {},
  },
]
