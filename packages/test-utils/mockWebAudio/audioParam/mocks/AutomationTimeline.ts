import type { BaseAudioContext } from "../../audioContext"

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

const isEventType = <T extends ScheduledEventType>(
  type: T,
  event: ScheduledEvent<any>
): event is ScheduledEvent<T> => event.type === type

/** An internal class for handling the scheduling of AudioParam value state */
export class AutomationTimeline {
  handleTimeChange = () => {
    const currentTime = this.context.currentTime

    let effectiveSet: {
      value: number
      time: number
      callSequence: number
    } | null = null

    // todo: combos of equal set/ramp end/target start times

    // in past: treated as if at currentTime (verified in setValueCurveAtTime error)
    // in past (cont):
    // same time as another set: last call wins
    // during active ramp: ramp re-calculates value based on new set value and time and the ramp end time
    // same as end of ramp: last called wins (note that no ramp occurs if set is called first, probably because it's treated as its start and end points simultaneously)
    // before active curve began (set in past): curve stops operation but sets final value (event schedule call)
    // during active curve: exception thrown, curve continues unaffected
    // same time as curve start: if set is the last called throws exception, otherwise curve start value wins and curve continues
    // same time as curve end: last called wins final value
    // during target: target cancelled
    // same time as target start: if set last, target cancelled, otherwise target continues from set's value
    // same time as cancel: last called wins
    for (const set of this._events.set) {
      if (
        set.data.time <= currentTime &&
        /** @todo refactor condition */
        set.data.time > (effectiveSet?.time ?? -Infinity) &&
        !(
          effectiveSet &&
          set.data.time === effectiveSet.time &&
          set.callSequence < effectiveSet.callSequence
        )
      ) {
        effectiveSet = {
          value: set.data.value,
          time: set.data.time,
          callSequence: set.callSequence,
        }
      }
    }

    // todo: verify that the end ramps have same behavior as set in general
    // general: calculated via diff from last effective set
    // overlapping ramps (multiple ramps between set times): value reset to last effective set value, no change occurs during overlap, last ramp continue after
    // same time as another ramp: last call wins its ending value, but first call wins the ramp up to the final value
    // end within curve: throws error and does not seem to have any effect (probably should be guarded from scheduling at all)
    // end within target: takes over, new set at beginning of ramp
    for (const ramp of this._events.ramp) {
      if (
        ramp.data.endTime <= currentTime &&
        ramp.data.endTime >= (effectiveSet?.time ?? -Infinity) &&
        !(
          effectiveSet &&
          ramp.data.endTime === effectiveSet.time &&
          ramp.callSequence < effectiveSet.callSequence
        )
      ) {
        effectiveSet = {
          value: ramp.data.value,
          time: ramp.data.endTime,
          callSequence: ramp.callSequence,
        }
      }
    }

    // todo review all below
    // overlaps set time: throws error
    // overlaps active ramp: throws error
    // overlaps target start time: throws error
    // overlaps active curve: throws error
    // overlaps curve that threw error: begins curve that is interrupted by error curve's end value at its end time. this curve also sets its last value at its end time (UGH)
    // if error thrown, the final value is still next effective set at the end of the curve time...
    for (const curve of this._events.curve) {
      const endTime = curve.data.startTime + curve.data.duration
      const isFinished = endTime <= currentTime
      /** @todo refactor this condition */
      if (
        isFinished &&
        endTime >= (effectiveSet?.time ?? -Infinity) &&
        !(
          effectiveSet &&
          endTime === effectiveSet.time &&
          curve.callSequence < effectiveSet.callSequence
        )
      ) {
        effectiveSet = {
          value: curve.data.values[curve.data.values.length - 1],
          time: currentTime,
          callSequence: curve.callSequence,
        }
      }
    }

    // seems to behave like the start time is a set when a curve overlaps with it, but
    // ramps begin as if a set occurred at the beginning of their own call once a target has been
    // set, which makes it behave as if the audio param is fresh with no other sets (target is active)
    for (const target of this._events.target) {
    }
  }

  protected setValue: (value: number) => void

  constructor(
    protected context: BaseAudioContext,
    initialValue: number,
    valueChangeCallback: (value: number) => void
  ) {
    this.setValue = (value: number, mark = true) => {
      valueChangeCallback(value)
      if (mark) {
        this._valueMarker = {
          value,
          time: this.context.currentTime,
          isInitial: false,
        }
      }
    }

    this._valueMarker = {
      value: initialValue,
      time: context.currentTime,
      isInitial: true,
    }
  }

  schedule<T extends ScheduledEventType>(
    type: T,
    data: ScheduledEventTypeMap[T]
  ) {
    this._events[type].push({
      type,
      data,
      callSequence: this._eventCallCount++,
    })
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

  protected _setValueMarker({ value, time }: { value: number; time?: number }) {
    this._valueMarker = {
      value,
      time: time ?? this.context.currentTime,
      isInitial: false,
    }
  }
}
