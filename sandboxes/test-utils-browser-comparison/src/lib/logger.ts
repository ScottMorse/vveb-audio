import { createLogger } from "@vveb-audio/core/logger"

export const appLogger = createLogger({
  contextName: "app",
  printLevel: "debug",
})
