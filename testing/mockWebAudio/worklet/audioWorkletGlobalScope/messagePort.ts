/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */

export class MessagePort {
  postMessage(message: any, transfer: Transferable[]): void
  postMessage(
    message: any,
    options?: StructuredSerializeOptions | undefined
  ): void
  postMessage(message: unknown, options?: unknown): void {}

  start(): void {}

  close(): void {}

  addEventListener<K extends keyof MessagePortEventMap>(
    type: K,
    listener: (this: MessagePort, ev: MessagePortEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions | undefined
  ): void
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined
  ): void {}

  removeEventListener<K extends keyof MessagePortEventMap>(
    type: K,
    listener: (this: MessagePort, ev: MessagePortEventMap[K]) => any,
    options?: boolean | EventListenerOptions | undefined
  ): void
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions | undefined
  ): void {}

  dispatchEvent(event: Event): boolean {
    return true
  }

  onmessage: ((this: MessagePort, ev: MessageEvent) => any) | null = null
  onmessageerror: ((this: MessagePort, ev: MessageEvent) => any) | null = null
}
