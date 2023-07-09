import {
  getInternals,
  MockConstructorName,
} from "@@test-utils/mockWebAudio/api/baseMock"
import { MockBaseAudioContext } from "../base"
import { MockOfflineAudioContextInternals } from "./MockOfflineAudioContextInternals"

@MockConstructorName("OfflineAudioContext")
export class MockOfflineAudioContext
  extends MockBaseAudioContext<MockOfflineAudioContextInternals>
  implements OfflineAudioContext
{
  /* eslint-disable lines-between-class-members */
  constructor(options: OfflineAudioContextOptions)
  constructor(numberOfChannels: number, length: number, sampleRate: number)
  constructor(
    arg1: number | OfflineAudioContextOptions,
    length?: number,
    sampleRate?: number
  ) {
    super(
      new MockOfflineAudioContextInternals(
        arg1 as number,
        length as number,
        sampleRate as number
      )
    )
  }
  /* eslint-enable lines-between-class-members */

  get length() {
    return getInternals(this).length
  }

  get oncomplete() {
    return getInternals(this).oncomplete
  }

  set oncomplete(value) {
    getInternals(this).oncomplete = value
  }

  resume() {
    return getInternals(this).resume()
  }

  get sampleRate() {
    return getInternals(this).sampleRate
  }

  startRendering() {
    return getInternals(this).startRendering()
  }

  suspend(time: number) {
    return getInternals(this).suspend(time)
  }
}
