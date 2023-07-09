import { listenOnce, TypedEventTarget } from "@@core/internal/util/events"
import { assertIsBrowser, getIsBrowser } from "@@core/internal/util/isBrowser"

const TRIGGERING_EVENTS = ["click", "touchend", "keydown"] as const

class Listener extends TypedEventTarget<{
  canStart: Event
}> {
  canStart = false

  protected _listen() {
    for (const event of TRIGGERING_EVENTS) {
      listenOnce(window, event, () => {
        this.dispatchEvent(new Event("canStart"))
        this.canStart = true
      })
    }
  }

  start() {
    if (this.canStart) return
    this._listen()
  }
}

const initializeListener = () => {
  const listener = new Listener()
  listener.start()
  return listener
}

const MODULE_STATE = {
  listener: getIsBrowser() ? initializeListener() : undefined,
}

export const waitForCanStartAudioContext = async (callback?: () => unknown) => {
  assertIsBrowser(
    "listenToAudioContextCanStart is only available in a browser environment."
  )

  if (!MODULE_STATE.listener) {
    MODULE_STATE.listener = initializeListener()
  }

  const listener = MODULE_STATE.listener as Listener

  if (listener.canStart) {
    callback?.()
    return
  }

  await new Promise<void>((resolve) =>
    listenOnce(listener, "canStart", () => {
      resolve()
      callback?.()
    })
  )
}
