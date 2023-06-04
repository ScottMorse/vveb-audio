import { AnyFunction } from "@@core/internal/util/types"

/** For handling how a callback value is treated when setting a property such as BaseAudioContext.prototype.onstatechange */
export const sanitizeEventCallback = (callback: AnyFunction | null) =>
  callback && (typeof callback === "function" || typeof callback === "object")
    ? callback
    : null
