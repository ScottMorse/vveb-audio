import isEqual from "lodash/isEqual"
import { getIsLocalHost } from "@@core/internal/util/isLocalhost"
import { ArrayItem } from "@@core/internal/util/types"
import { TypedEventTarget } from "@@core/internal/util/events"

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

export class LogEvent extends Event {
  constructor(
    public log: Log,
    public logContextName: string,
    eventInitDict?: EventInit
  ) {
    super("log", eventInitDict)
  }
}

type LoggerEvents = {
  log: LogEvent
}

const LOG_EMITTER = new TypedEventTarget<LoggerEvents>()

const DEFAULT_PRINT_LEVEL =
  process.env.NODE_ENV === "development" || getIsLocalHost() ? "warn" : "error"

const getLogSequence = (level: LogLevel) => LOG_LEVELS.indexOf(level)

const validateLevel = <IsSetting extends boolean = false>(
  level: string,
  isSetting: IsSetting = false as IsSetting
): level is IsSetting extends true ? LogLevelSetting : LogLevel => {
  const isValid =
    (isSetting && level === SILENT) || getLogSequence(level as LogLevel) > -1
  if (!isValid && getIsLocalHost()) {
    console.warn(new Error(`vveb-audio: Invalid log level '${level}'`))
  }
  return isValid
}

const isLevelAtLeast = (level: LogLevel, levelSetting: LogLevelSetting) =>
  levelSetting !== SILENT &&
  getLogSequence(level) >= getLogSequence(levelSetting)

type InstanceLogLevelSetting = LogLevelSetting | "default"

interface LoggerOptions {
  printLevel?: InstanceLogLevelSetting
  contextName?: string
}

/** @todo doc test. doc site could have window.vvebAudioLogger present */
class _Logger {
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
        this._log({ level, message, metadata: metadata ?? {} })
      }
    } catch (error) {
      console.error("vveb-audio: Failed to log", {
        error,
        level,
        message,
        metadata,
      })
    }
  }

  warnNotImplemented() {
    this.warn(new Error("Not implemented"))
  }

  get printLevel() {
    return this.resolvePrintLevel()
  }

  set printLevel(level: InstanceLogLevelSetting) {
    this._printLevel = level
  }

  get contextName(): string {
    return this._contextName ?? ""
  }

  set contextName(name: string | null) {
    this._contextName = name ?? undefined
  }

  constructor(options?: LoggerOptions) {
    this._printLevel = options?.printLevel ?? "default"
    this._contextName = options?.contextName
  }

  private _contextName?: string
  private _printLevel: InstanceLogLevelSetting = "default"

  private _log(log: Log) {
    this.printLog(log)
    LOG_EMITTER.dispatchEvent(new LogEvent(log, this.contextName))
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
    return this._printLevel === "default"
      ? _Logger.printLevel
      : this._printLevel
  }

  private formatLog(log: Log) {
    return `[vveb-audio: ${log.level.toUpperCase()}]${
      this._contextName ? ` [${this._contextName}]` : ""
    } ${
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

export type Logger = _Logger

export const createLogger = (options?: LoggerOptions): Logger =>
  new _Logger(options)

export const setVVebLogLevel = (level: InstanceLogLevelSetting) => {
  _Logger.printLevel = level === "default" ? DEFAULT_PRINT_LEVEL : level
}

export const logger = new _Logger()

export const listenToVVebLogs = <Event extends keyof LoggerEvents>(
  event: Event,
  listener: (event: LoggerEvents[Event]) => void
) => {
  LOG_EMITTER.addEventListener(event, listener)
}

export const removeListenToVVebLogs = <Event extends keyof LoggerEvents>(
  event: Event,
  listener: (event: LoggerEvents[Event]) => void
) => {
  LOG_EMITTER.removeEventListener(event, listener)
}
