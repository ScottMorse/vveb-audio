import { StringKeyOf } from "@@core/internal/util/types"

export type BaseEventConfig = { [key: string]: Event }

type EventArgs<
  E extends keyof EventConfig,
  EventConfig extends BaseEventConfig
> = EventConfig[E]

const _TypedEventTarget = EventTarget as unknown as new <
  EventConfig extends BaseEventConfig
>() => {
  addEventListener<E extends StringKeyOf<EventConfig>>(
    event: E,
    listener: (event: EventConfig[E]) => any
  ): typeof _TypedEventTarget<EventConfig>

  removeEventListener<E extends StringKeyOf<EventConfig>>(
    event: E,
    listener: (event: EventConfig[E]) => any
  ): typeof _TypedEventTarget<EventConfig>

  dispatchEvent<E extends StringKeyOf<EventConfig>>(
    event: EventConfig[E]
  ): boolean
}

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
 * const emitter = new TypedEventTarget<MyEvents>()
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
export class TypedEventTarget<
  EventConfig extends BaseEventConfig = BaseEventConfig
> extends _TypedEventTarget<EventConfig> {}
