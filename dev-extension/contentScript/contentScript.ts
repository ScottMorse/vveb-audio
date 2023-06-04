/** A script loaded to the user's page that provides utilities to the console. */

import { createLogger } from "@vveb-audio/core/logger"

const logger = createLogger({
  contextName: "Dev Content Script",
  printLevel: "debug",
})

declare global {
  // eslint-disable-next-line no-var
  var audioContext: AudioContext
}

const SCRIPT_ID = "vveb-audio-dev-extension-user-script"

const run = () => {
  logger.debug("Initialized")
  if (!document.getElementById(SCRIPT_ID)) {
    logger.info("Injecting User Script")
    const script = document.createElement("script")
    script.id = SCRIPT_ID
    script.src = chrome.runtime.getURL("userScript.js")
    document.body.appendChild(script)
  }
}

run()

export {}
