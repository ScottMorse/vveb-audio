import { StringKeyOf } from "@@core/internal/util/types"

export interface TypedEvent<TypeName extends string = string> extends Event {
  type: TypeName
}

export const TypedEvent = Event as unknown as {
  prototype: TypedEvent
  new <TypeName extends string = string>(
    type: TypeName,
    options?: EventInit
  ): TypedEvent<TypeName>
}

export type BaseEventConfig = { [key: string]: TypedEvent }

type EventFromName<
  E extends keyof EventConfig,
  EventConfig extends BaseEventConfig
> = EventConfig[E]

export interface TypedEventTarget<
  EventConfig extends BaseEventConfig = BaseEventConfig
> {
  addEventListener<EventName extends keyof EventConfig>(
    event: EventName,
    listener: (event: EventFromName<EventName, EventConfig>) => any
  ): void

  removeEventListener<EventName extends keyof EventConfig>(
    event: EventName,
    listener: (event: EventFromName<EventName, EventConfig>) => any
  ): void

  dispatchEvent<EventName extends keyof EventConfig>(
    event: EventFromName<EventName, EventConfig>
  ): boolean
}

/**
 * A standard EventTarget that provides enhanced typing for specific events.
 *
 * The EventConfig generic type should map event names to the type of
 * Event that will be dispatched for that event name. You should also
 * use the `TypedEvent` type to create your event types, which similarly
 * is just a standard Event with enhanced typing.
 *
 * @example
 * ```typescript
 * // A TypedEvent is essentially a simple type wrapper around a plain native Event
 * // that defines a specific string name for the event type name
 * class MyEvent extends TypedEvent<"eventB"> {
 *   foo = "bar"
 * }
 *
 * type MyEvents = {
 *   eventA: TypedEvent<"eventA">
 *   eventB: MyEvent
 * }
 *
 * const target = new TypedEventTarget<MyEvents>()
 *
 * target.dispatchEvent(new TypedEvent("eventA")) // event type name must match "eventA" thanks to TypedEvent used in MyEvents
 * target.dispatchEvent(new MyEvent("eventB")) // event instance type must match for eventB thanks to the MyEvents type
 *
 * target.addEventListener("eventA", (event) => {
 *   console.log(event.type) // "eventA" (strictly typed)
 * })
 *
 * target.addEventListener("eventB", (event) => {
 *   console.log(event.type) // "eventB" (strictly typed)
 *   console.log(event.foo) // "bar" matches MyEvent type
 * })
 *
 * ```
 */
export const TypedEventTarget = EventTarget as unknown as {
  prototype: TypedEventTarget
  new <
    EventConfig extends BaseEventConfig = BaseEventConfig
  >(): TypedEventTarget<EventConfig>
}
