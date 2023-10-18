import { MockEnvironment } from "@@test-utils/mockWebAudio/api/mockFactory"
import { sanitizeEventCallback } from "@@test-utils/mockWebAudio/util/events"
import { OmitEventTarget } from "@@test-utils/mockWebAudio/util/types"
import { createMockAudioParamMap } from "../../audioParamMap"
import { createMockMessagePort } from "../../messagePort"
import { MockAudioNodeInternals } from "../base/MockAudioNodeInternals"

export class MockAudioWorkletNodeInternals
  extends MockAudioNodeInternals
  implements OmitEventTarget<AudioWorkletNode>
{
  constructor(
    mock: AudioWorkletNode,
    mockEnvironment: MockEnvironment,
    context: BaseAudioContext
  ) {
    super(mock, mockEnvironment, context)
  }

  get onprocessorerror(): ((this: AudioWorkletNode, ev: Event) => any) | null {
    return this._onprocessorerror
  }

  set onprocessorerror(
    value: ((this: AudioWorkletNode, ev: Event) => any) | null
  ) {
    this._onprocessorerror = sanitizeEventCallback(value)
  }

  get parameters() {
    return this._parameters
  }

  get port() {
    return this._port
  }

  protected _onprocessorerror:
    | ((this: AudioWorkletNode, ev: Event) => any)
    | null = null

  protected _port: MessagePort = createMockMessagePort(this.mockEnvironment)

  protected _parameters: AudioParamMap = createMockAudioParamMap(
    this.mockEnvironment
  )
}
