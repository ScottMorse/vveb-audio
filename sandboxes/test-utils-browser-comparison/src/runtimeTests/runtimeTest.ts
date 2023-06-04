import { Mock } from "../lib/mock"

export interface RuntimeTestContext {
  ctx: AudioContext
  mockCtx: Mock.AudioContext
  offlineCtx: OfflineAudioContext
  mockOfflineCtx: Mock.OfflineAudioContext
}

export type RuntimeTestFunction = (
  context: RuntimeTestContext
) => Promise<unknown>

export interface RuntimeTest {
  name: string
  test: RuntimeTestFunction
  isolatedOnly?: boolean
}
