import {
  MockEnvironment,
  createMockFactory,
} from "@@test-utils/mockWebAudio/api/mockFactory"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { MockMessagePortInternals } from "./MockMessagePortInternals"

const ALLOW_CONSTRUCTOR = Symbol("ALLOW_CONSTRUCTOR")

export const createMessagePortMock = createMockFactory<
  typeof MessagePort,
  MockMessagePortInternals
>(({ getInternals, setInternals, mockEnvironment }) => {
  @MockConstructorName("MessagePort")
  class MockMessagePort extends EventTarget implements MessagePort {
    constructor(_allow?: typeof ALLOW_CONSTRUCTOR) {
      if (_allow !== ALLOW_CONSTRUCTOR) {
        throw new TypeError("Illegal constructor")
      }
      super()
      setInternals(this, new MockMessagePortInternals(this, mockEnvironment))
    }

    close() {
      getInternals(this).close()
    }

    get onmessage(): ((this: MessagePort, ev: MessageEvent) => any) | null {
      return getInternals(this).onmessage
    }

    get onmessageerror():
      | ((this: MessagePort, ev: MessageEvent) => any)
      | null {
      return getInternals(this).onmessageerror
    }

    /* eslint-disable lines-between-class-members */
    postMessage(message: any, transfer: Transferable[]): void
    postMessage(
      message: any,
      options?: StructuredSerializeOptions | undefined
    ): void
    postMessage(
      message: any,
      options?: Transferable[] | StructuredSerializeOptions
    ): void {
      getInternals(this).postMessage(message, options as any)
    }
    /* eslint-enable lines-between-class-members */

    start() {
      getInternals(this).start()
    }
  }

  return MockMessagePort
})

export const createMockMessagePort = (mockEnvironment: MockEnvironment) => {
  return new mockEnvironment.api.MessagePort(
    ...([ALLOW_CONSTRUCTOR] as unknown as [])
  )
}
