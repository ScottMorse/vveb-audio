import { EventEmitter } from "events"
import { StringKeys } from "@/lib/util/types"

type BaseEventConfig = { [key: string]: any }

type EventArgs<
  E extends keyof EventConfig,
  EventConfig extends BaseEventConfig
> = EventConfig[E] extends undefined ? [] : [EventConfig[E]]

interface _TypedEventEmitter<EventConfig extends BaseEventConfig> {
  emit<E extends StringKeys<EventConfig>>(
    event: E,
    ...args: EventArgs<E, EventConfig>
  ): boolean

  on<E extends StringKeys<EventConfig>>(
    event: E,
    listener: (...args: EventArgs<E, EventConfig>) => void
  ): _TypedEventEmitter<EventConfig>

  off<E extends StringKeys<EventConfig>>(
    event: E,
    listener: (...args: EventArgs<E, EventConfig>) => void
  ): _TypedEventEmitter<EventConfig>

  once<E extends StringKeys<EventConfig>>(
    event: E,
    listener: (...args: EventArgs<E, EventConfig>) => void
  ): _TypedEventEmitter<EventConfig>

  prependListener<E extends StringKeys<EventConfig>>(
    event: E,
    listener: (...args: EventArgs<E, EventConfig>) => void
  ): _TypedEventEmitter<EventConfig>

  prependOnceListener<E extends StringKeys<EventConfig>>(
    event: E,
    listener: (...args: EventArgs<E, EventConfig>) => void
  ): _TypedEventEmitter<EventConfig>

  eventNames(): StringKeys<EventConfig>[]

  listenerCount<E extends StringKeys<EventConfig>>(event: E): number

  removeAllListeners<E extends StringKeys<EventConfig>>(
    event?: E
  ): _TypedEventEmitter<EventConfig>

  rawListeners<E extends StringKeys<EventConfig>>(
    event: E
  ): ReturnType<EventEmitter["rawListeners"]>[]

  listeners<E extends StringKeys<EventConfig>>(
    event: E
  ): ReturnType<EventEmitter["rawListeners"]>[]

  addListener: _TypedEventEmitter<EventConfig>["on"]
  removeListener: _TypedEventEmitter<EventConfig>["off"]
}

type TypedEventEmitterInstance<EventConfig extends BaseEventConfig> =
  _TypedEventEmitter<EventConfig> &
    Omit<EventEmitter, keyof _TypedEventEmitter<EventConfig>>

/**
 * A standard EventEmitter that provides enhanced typing for specific events.
 *
 * The EventConfig generic type should map event names to the value
 * that will be passed to a listener. The event emitter is then required to
 * emit events with the correct value type, and listeners must expect
 * the correct type parameter.
 *
 * @example
 * ```typescript
 * interface MyEvents {
 *   customEventA: string,
 *   customEventB: { foo: 'bar' | 'baz' },
 *   customEventC: undefined,
 * }
 *
 * const emitter = new TypedEventEmitter<MyEvents>()
 *
 * emitter.emit('customEventA', 'something') // verified payload for customEventA
 * emitter.emit('customEventB', { foo: 'bar' }) // verified payload for customEventB
 * emitter.emit('customEventC') // arg not required for customEventC when payload is undefined
 *
 * emitter.on('customEventA', (s: string) => console.log(s)) // verified listener arg for customEventA
 * emitter.on('customEventB', (obj) => console.log(obj.foo)) // verified listener arg for customEventB
 * emitter.on('customEventC', () => console.log('C fired')) // no listener arg for customEventC when payload is undefined
 * ```
 */
export const TypedEventEmitter = EventEmitter as any as new <
  EventConfig extends BaseEventConfig
>() => TypedEventEmitterInstance<EventConfig>
