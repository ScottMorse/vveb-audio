import isEqual from "lodash/isEqual"
import { IS_LOCALHOST } from "@/lib/util/isLocalhost"
import { ArrayItem } from "@/lib/util/types"
import { TypedEventEmitter } from "../util/events"

const LOG_LEVELS = ["debug", "info", "warn", "error"] as const

const SILENT = "silent"

export type LogLevel = ArrayItem<typeof LOG_LEVELS>

export type LogLevelSetting = LogLevel | typeof SILENT

export type LogMessage = string | Error

export type LogMetadata = Record<string, any>

export interface Log {
  message: LogMessage
  level: LogLevel
  metadata: LogMetadata
}

interface LoggerEvents {
  log: Log
}

const DEFAULT_PRINT_LEVEL = IS_LOCALHOST ? "warn" : "error"

const getLogSequence = (level: LogLevel) => LOG_LEVELS.indexOf(level)

const validateLevel = <IsSetting extends boolean = false>(
  level: string,
  isSetting: IsSetting = false as IsSetting
): level is IsSetting extends true ? LogLevelSetting : LogLevel => {
  const isValid =
    (isSetting && level === SILENT) || getLogSequence(level as LogLevel) > -1
  if (!isValid && IS_LOCALHOST) {
    console.warn(new Error(`vveb-audio: Invalid log level '${level}'`))
  }
  return isValid
}

const isLevelAtLeast = (level: LogLevel, levelSetting: LogLevelSetting) =>
  levelSetting !== SILENT &&
  getLogSequence(level) >= getLogSequence(levelSetting)

type InstanceLogLevelSetting = LogLevelSetting | "default"

/** @todo doc test. doc site could have window.vvebAudioLogger present */
export class Logger extends TypedEventEmitter<LoggerEvents> {
  static get printLevel() {
    return this._printLevel
  }

  static set printLevel(level: LogLevelSetting) {
    if (validateLevel(level)) {
      this._printLevel = level
    }
  }

  debug(message: LogMessage, metadata?: LogMetadata) {
    this.log("debug", message, metadata)
  }

  info(message: LogMessage, metadata?: LogMetadata) {
    this.log("info", message, metadata)
  }

  warn(message: LogMessage, metadata?: LogMetadata) {
    this.log("warn", message, metadata)
  }

  error(message: LogMessage, metadata?: LogMetadata) {
    this.log("error", message, metadata)
  }

  log(level: LogLevel, message: LogMessage, metadata?: LogMetadata) {
    try {
      if (validateLevel(level)) {
        this._log({ level, message, metadata: metadata || {} })
      }
    } catch (error) {
      console.error("vveb-audio: Failed to log", error)
    }
  }

  get printLevel() {
    return this.resolvePrintLevel()
  }

  set printLevel(level: InstanceLogLevelSetting) {
    this._printLevel = level
  }

  constructor(printLevel: InstanceLogLevelSetting = "default") {
    super()
    this._printLevel = printLevel
  }

  private _printLevel: InstanceLogLevelSetting = "default"

  private _log(log: Log) {
    this.printLog(log)
    this.emit("log", log)
  }

  private printLog(log: Log) {
    if (isLevelAtLeast(log.level, this.resolvePrintLevel())) {
      console[log.level](
        this.formatLog(log),
        ...this.createMetadataArgs(log.metadata)
      )
    }
  }

  private resolvePrintLevel() {
    return this._printLevel === "default" ? Logger.printLevel : this._printLevel
  }

  private formatLog(log: Log) {
    return `[vveb-audio: ${log.level.toUpperCase()}] ${
      log.message instanceof Error
        ? `Error: ${log.message.message}\nStack:${log.message.stack?.replace(
            "Error:",
            ""
          )}`
        : log.message
    }`
  }

  private createMetadataArgs(metadata: LogMetadata) {
    return isEqual(metadata, {})
      ? []
      : [
          {
            metadata,
          },
        ]
  }

  private static _printLevel: LogLevelSetting = DEFAULT_PRINT_LEVEL
}

export const setVVebLogLevel = (level: InstanceLogLevelSetting) => {
  Logger.printLevel = level === "default" ? DEFAULT_PRINT_LEVEL : level
}

export const logger = new Logger()
