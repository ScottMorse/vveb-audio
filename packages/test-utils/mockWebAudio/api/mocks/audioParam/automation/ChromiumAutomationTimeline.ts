import { AutomationTimeline } from "./AutomationTimeline"
import { ScheduledEvent, ScheduledEventType } from "./scheduledEvents"

export class ChromiumAutomationTimeline extends AutomationTimeline {
  handleTimeChange() {
    const currentTime = this.context.currentTime

    let effectiveSet: {
      value: number
      time: number
      callSequence: number
    } | null = null

    // todo: combos of equal set/ramp end/target start times

    // in past: treated as if at currentTime (verified in setValueCurveAtTime error)
    // in past (cont): When multiple calls are made in the past, the one with the largest time is used. This becomes a set at its time, but only after a few ms does it actually become a set at the previous current time....
    // in past (cont): Multiple of these past calls' temporary past sets will all be effective briefly, so the earliest one that clashes with a value curve scheduled overlapping one of them during these few ms, it will throw an error
    // in past (cont): Once the set becomes the current time of these past calls, the remaining calls that didn't take effect are forgotten
    // in past (cont): * Maybe this last bit only happens on Brave on Arch linux. (should be tried elsewhere)
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
    for (const setOp of this._events.set) {
      if (
        // time is in past or at current time
        setOp.data.time <= currentTime &&
        setOp.data.time > (effectiveSet?.time ?? -Infinity) &&
        // operation is latest call for given time
        !(
          effectiveSet &&
          setOp.data.time === effectiveSet.time &&
          setOp.callSequence < effectiveSet.callSequence
        )
      ) {
        effectiveSet = {
          value: setOp.data.value,
          time: setOp.data.time,
          callSequence: setOp.callSequence,
        }
      }
    }

    // todo: verify that the end ramps have same behavior as set in general
    // general: calculated via diff from last effective set
    // overlapping ramps (multiple ramps between set times): value reset to last effective set value, no change occurs during overlap, last ramp continue after
    // same time as another ramp: last call wins its ending value, but first call wins the ramp up to the final value
    // end within curve: throws error and does not seem to have any effect (probably should be guarded from scheduling at all)
    // end within target: takes over, new set at beginning of ramp
    for (const rampOp of this._events.ramp) {
      if (
        rampOp.data.endTime <= currentTime &&
        rampOp.data.endTime >= (effectiveSet?.time ?? -Infinity) &&
        !(
          effectiveSet &&
          rampOp.data.endTime === effectiveSet.time &&
          rampOp.callSequence < effectiveSet.callSequence
        )
      ) {
        effectiveSet = {
          value: rampOp.data.value,
          time: rampOp.data.endTime,
          callSequence: rampOp.callSequence,
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
    for (const curveOp of this._events.curve) {
      const endTime = curveOp.data.startTime + curveOp.data.duration
      const isFinished = endTime <= currentTime
      /** @todo refactor this condition */
      if (
        isFinished &&
        endTime >= (effectiveSet?.time ?? -Infinity) &&
        !(
          effectiveSet &&
          endTime === effectiveSet.time &&
          curveOp.callSequence < effectiveSet.callSequence
        )
      ) {
        effectiveSet = {
          value: curveOp.data.values[curveOp.data.values.length - 1],
          time: currentTime,
          callSequence: curveOp.callSequence,
        }
      }
    }

    // seems to behave like the start time is a set when a curve overlaps with it, but
    // ramps begin as if a set occurred at the beginning of their own call once a target has been
    // set, which makes it behave as if the audio param is fresh with no other sets (target is active)
    for (const targetOp of this._events.target) {
      void targetOp
    }
  }

  protected _onSchedule<T extends ScheduledEventType>(
    type: T,
    data: ScheduledEvent<T>
  ): void {
    void type
    void data
  }
}
