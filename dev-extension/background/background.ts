import { createLogger } from "@vveb-audio/core/logger"

const logger = createLogger({
  contextName: "Extension Background",
  printLevel: "debug",
})

logger.info("Extension background script loaded")

const runContentScript = (tabId: number) => {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ["contentScript.js"],
  })
}

const run = () => {
  chrome.tabs.onCreated.addListener((tab) => {
    const tabId = tab.id as number
    logger.info("Running content script on new tab", { tab })
    runContentScript(tabId)
  })
  chrome.tabs.onUpdated.addListener((tabId) => {
    logger.info("Running content script on tab update", { tabId })
    runContentScript(tabId)
  })
}

run()
