import { logger } from "@/lib/logger"
import { TypedEventEmitter } from "@/lib/util/events"
import { IS_BROWSER } from "@/lib/util/isBrowser"

const TRIGGERING_EVENTS = ["keydown", "click", "touchend"] as const

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
    if (!this._success) {
      this.startListening()
    }
    return this
  }

  constructor() {
    super()
    this.startListening()
  }

  private startListening() {
    this._success = listenForUserInteraction(() => {
      this.handleCanStart()
    })
  }

  private handleCanStart = () => {
    this._canStart = true
    logger.info("Audio contexts can now start")
    this.emit("canStart")
  }

  private _canStart = false
  private _success = false
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
