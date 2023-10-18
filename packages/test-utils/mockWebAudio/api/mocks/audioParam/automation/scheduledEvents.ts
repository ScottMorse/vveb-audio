
/**
 * Event types are grouped this way to
 * due to the close commonalities in how
 * some of the events are handled
 */
export interface ScheduledEventTypeMap {
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

export interface ScheduledEvent<T extends ScheduledEventType = ScheduledEventType> {
  type: T
  callSequence: number
  data: ScheduledEventTypeMap[T]
}

