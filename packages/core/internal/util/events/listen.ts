import { StringKeyOf } from "../types"
import { BaseEventConfig, TypedEventTarget } from "./typedEventTarget"

export const listenOnce = <
  Target extends EventTarget | TypedEventTarget<E>,
  E extends BaseEventConfig = BaseEventConfig
>(
  target: Target,
  type: Target extends TypedEventTarget ? StringKeyOf<E> : string,
  listener: (...args: any[]) => any
) => {
  const removeListener = () => {
    listener()
    target.removeEventListener(type as StringKeyOf<E>, listener)
  }
  target.addEventListener(type as StringKeyOf<E>, removeListener)
}
