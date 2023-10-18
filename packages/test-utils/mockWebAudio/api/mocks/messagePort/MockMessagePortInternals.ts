import { MockInternals } from "@@test-utils/mockWebAudio/api/mockFactory"
import { sanitizeEventCallback } from "@@test-utils/mockWebAudio/util/events"
import { OmitEventTarget } from "@@test-utils/mockWebAudio/util/types"

export class MockMessagePortInternals
  extends MockInternals<MessagePort>
  implements OmitEventTarget<MessagePort>
{
  close(): void {}

  get onmessage(): ((this: MessagePort, ev: MessageEvent) => any) | null {
    return this._onmessage
  }

  set onmessage(value: ((this: MessagePort, ev: MessageEvent) => any) | null) {
    this._onmessage = sanitizeEventCallback(value)
  }

  get onmessageerror(): ((this: MessagePort, ev: MessageEvent) => any) | null {
    return this._onmessageerror
  }

  set onmessageerror(
    value: ((this: MessagePort, ev: MessageEvent) => any) | null
  ) {
    this._onmessageerror = sanitizeEventCallback(value)
  }

  /* eslint-disable lines-between-class-members */
  postMessage(message: any, transfer: Transferable[]): void
  postMessage(message: any, options?: StructuredSerializeOptions): void
  postMessage(
    message: unknown,
    _options?: StructuredSerializeOptions | Transferable[]
  ) {
    /** @todo low priority but double check this event's props */
    const event = new MessageEvent("message", { data: message })
    this.mock.dispatchEvent(event)
    this.onmessage?.call(this.mock, event)
  }
  /* eslint-enable lines-between-class-members */

  start(): void {}

  protected _onmessage: ((this: MessagePort, ev: MessageEvent) => any) | null =
    null

  protected _onmessageerror:
    | ((this: MessagePort, ev: MessageEvent) => any)
    | null = null
}
