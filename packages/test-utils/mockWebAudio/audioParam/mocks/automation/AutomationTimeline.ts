import type { BaseAudioContext } from "../../../audioContext"

/**
 * Event types are grouped this way to
 * due to the close commonalities in how
 * some of the events are handled
 */
interface ScheduledEventTypeMap {
  set: {
    time: number
    value: number
  }
  ramp: {
    kind: "linear" | "exponential"
    endTime: number
    value: number
  }
  target: {
    startTime: number
    target: number
    timeConstant: number
  }
  curve: {
    startTime: number
    values: Float32Array
    duration: number
  }
  cancel: { cancelTime: number; hold: boolean }
}

export type ScheduledEventType = keyof ScheduledEventTypeMap

export interface ScheduledEvent<T extends ScheduledEventType> {
  type: T
  callSequence: number
  data: ScheduledEventTypeMap[T]
}

export interface AutomationTimelineOptions {
  initialValue: number
  valueChangeCallback: (value: number) => void
  context: BaseAudioContext
}

/** An internal class for handling the scheduling of AudioParam value state */
export abstract class AutomationTimeline {
  protected readonly context: BaseAudioContext

  protected setValue: (value: number) => void

  constructor(options: AutomationTimelineOptions) {
    this.setValue = (value: number, mark = true) => {
      options.valueChangeCallback(value)
      if (mark) {
        this._valueMarker = {
          value,
          time: this.context.currentTime,
          isInitial: false,
        }
      }
    }

    this.context = options.context

    this._valueMarker = {
      value: options.initialValue,
      time: options.context.currentTime,
      isInitial: true,
    }
  }

  abstract handleTimeChange(): void

  schedule<T extends ScheduledEventType>(
    type: T,
    data: ScheduledEventTypeMap[T]
  ) {
    this._events[type].push({
      type,
      data,
      callSequence: this._eventCallCount++,
    })
    this._onSchedule(type, data as any)
  }

  protected _activeRamp: ScheduledEvent<"ramp"> | null = null

  protected _valueMarker: { value: number; time: number; isInitial: boolean }

  protected _events: {
    [K in ScheduledEventType]: ScheduledEvent<K>[]
  } = {
    set: [],
    ramp: [],
    target: [],
    curve: [],
    cancel: [],
  }

  protected _eventCallCount = 0

  protected abstract _onSchedule<T extends ScheduledEventType>(
    type: T,
    data: ScheduledEvent<T>
  ): void

  protected _setValueMarker({ value, time }: { value: number; time?: number }) {
    this._valueMarker = {
      value,
      time: time ?? this.context.currentTime,
      isInitial: false,
    }
  }
}
