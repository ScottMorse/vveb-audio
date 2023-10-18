import type { MockWebAudioApi } from "../api/mockFactory"

export const MockConstructorName =
  (name: keyof MockWebAudioApi): ClassDecorator =>
  (target) => {
    Object.defineProperty(target, "name", {
      value: name,
    })

    target.prototype.toString = () => `[object ${name}]`
  }
