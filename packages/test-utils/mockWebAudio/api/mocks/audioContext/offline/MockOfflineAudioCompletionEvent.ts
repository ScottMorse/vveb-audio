import {
  BaseMock,
  getInternals,
  MockConstructorName,
} from "@@test-utils/mockWebAudio/api/baseMock"
import { MockOfflineAudioCompletionEventInternals } from "./MockOfflineAudioCompletionEventInternals"

@MockConstructorName("OfflineAudioCompletionEvent")
export class MockOfflineAudioCompletionEvent
  extends BaseMock<MockOfflineAudioCompletionEventInternals>
  implements OfflineAudioCompletionEvent
{
  constructor(
    type: string,
    options: { renderedBuffer: AudioBuffer },
    _offlineCtx: OfflineAudioContext
  ) {
    super(
      new MockOfflineAudioCompletionEventInternals(type, options, _offlineCtx)
    )
  }

  get AT_TARGET() {
    return getInternals(this).AT_TARGET
  }

  get bubbles() {
    return getInternals(this).bubbles
  }

  get BUBBLING_PHASE() {
    return getInternals(this).BUBBLING_PHASE
  }

  get cancelable() {
    return getInternals(this).cancelable
  }

  get cancelBubble() {
    return getInternals(this).cancelBubble
  }

  get CAPTURING_PHASE() {
    return getInternals(this).CAPTURING_PHASE
  }

  get composed() {
    return getInternals(this).composed
  }

  composedPath(): EventTarget[] {
    return getInternals(this).composedPath()
  }

  get currentTarget() {
    return getInternals(this).currentTarget
  }

  get defaultPrevented() {
    return getInternals(this).defaultPrevented
  }

  get eventPhase() {
    return getInternals(this).eventPhase
  }

  initEvent(
    type: string,
    bubbles?: boolean | undefined,
    cancelable?: boolean | undefined
  ): void {
    getInternals(this).initEvent(type, bubbles, cancelable)
  }

  get isTrusted() {
    return getInternals(this).isTrusted
  }

  get NONE() {
    return getInternals(this).NONE
  }

  preventDefault() {
    getInternals(this).preventDefault()
  }

  get renderedBuffer(): AudioBuffer {
    return getInternals(this).renderedBuffer
  }

  get returnValue() {
    return getInternals(this).returnValue
  }

  get srcElement() {
    return getInternals(this).srcElement
  }

  stopImmediatePropagation() {
    getInternals(this).stopImmediatePropagation()
  }

  stopPropagation(): void {
    getInternals(this).stopPropagation()
  }

  get target() {
    return getInternals(this).target
  }

  get timeStamp() {
    return getInternals(this).timeStamp
  }

  get type() {
    return getInternals(this).type
  }
}
