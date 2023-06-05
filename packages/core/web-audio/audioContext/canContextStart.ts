import { logger } from "@@core/logger"
import { TypedEventEmitter } from "@@core/internal/util/events"
import { IS_BROWSER } from "@@core/internal/util/isBrowser"

const TRIGGERING_EVENTS = ["keydown", "click", "touchend"] as const

/** Returns false if user interaction is not supported */
const listenForUserInteraction = (callback: () => void) => {
  if (!IS_BROWSER) {
    logger.error(
      new Error(
        "Cannot listen for user events to allow AudioContext without DOM (window is not present)"
      )
    )
    return false
  }
  const onTrigger = () => {
    callback()
    TRIGGERING_EVENTS.forEach((event) =>
      window.removeEventListener(event, onTrigger)
    )
  }
  TRIGGERING_EVENTS.forEach((event) =>
    window.addEventListener(event, onTrigger)
  )
  return true
}

export interface ContextCanStartListenerEvents {
  canStart: undefined
}

export class ContextCanStartListener extends TypedEventEmitter<ContextCanStartListenerEvents> {
  get canStart() {
    return this._canStart
  }

  listen() {
    if (!this._isSupported) {
      this.startListening()
    }
    return this
  }

  constructor() {
    super()
    this.startListening()
  }

  private startListening() {
    this._isSupported = listenForUserInteraction(() => {
      this.setCanStart()
    })
  }

  private setCanStart = () => {
    this._canStart = true
    logger.info("Audio contexts can now start")
    this.emit("canStart")
  }

  private _canStart = false
  private _isSupported = false
}

/**
 * Whether an AudioContext is allowed to start is scoped at the window.
 */
const GLOBAL_STATE: { listener: ContextCanStartListener | null } = {
  listener: null,
}

if (typeof window !== undefined) {
  GLOBAL_STATE.listener = new ContextCanStartListener()
}

export const getCanAudioContextStartListener = () => {
  GLOBAL_STATE.listener =
    GLOBAL_STATE.listener?.listen() || new ContextCanStartListener()
  return GLOBAL_STATE.listener
}
