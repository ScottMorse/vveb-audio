import { strict as assert } from "assert"
import { delay } from "@@core/internal/testing/delay"
import { getGlobalDeviceSetting } from "@@test-utils/internal/util/deviceSettings"
import { appLogger } from "../../lib/logger"
import { Mock } from "../../lib/engine"
import { compareErrors } from "../../lib/util"
import { RuntimeTest } from "../runtimeTest"

const createStateUtils = (
  offlineCtx: OfflineAudioContext,
  mockOfflineCtx: Mock.OfflineAudioContext
) => {
  type StateEventMetadata = { state: string; event: Event }
  const stateEvents: StateEventMetadata[] = []
  const mockStateEvents: StateEventMetadata[] = []

  type CompleteEventMetadata = { event: OfflineAudioCompletionEvent }
  const completeEvents: CompleteEventMetadata[] = []
  const mockCompleteEvents: CompleteEventMetadata[] = []

  offlineCtx.onstatechange = (event) => {
    stateEvents.push({ event, state: offlineCtx.state })
    appLogger.debug("onstatechange " + offlineCtx.state)
  }
  mockOfflineCtx.onstatechange = (event) => {
    mockStateEvents.push({ event, state: mockOfflineCtx.state })
    appLogger.debug("mock onstatechange " + mockOfflineCtx.state)
  }
  offlineCtx.oncomplete = (event) => {
    completeEvents.push({ event })
    appLogger.debug("oncomplete")
  }
  mockOfflineCtx.oncomplete = (event) => {
    mockCompleteEvents.push({ event })
    assert.equal(event.renderedBuffer.constructor.name, "AudioBuffer")
    assert.equal(event.renderedBuffer.numberOfChannels, 1)
    assert.equal(event.renderedBuffer.length, mockOfflineCtx.length)
    assert.equal(event.renderedBuffer.sampleRate, mockOfflineCtx.sampleRate)
  }

  const compareStates = (title: string) => {
    assert.equal(
      title + " " + offlineCtx.state,
      title + " " + mockOfflineCtx.state
    )
    assert.equal(
      title + " currentTime " + Math.floor(offlineCtx.currentTime),
      title + " currentTime " + Math.floor(mockOfflineCtx.currentTime)
    )
  }

  const compareEventCallbacks = (title: string) => {
    assert.equal(
      title + " onstatechange count " + stateEvents.length,
      title + " onstatechange count " + mockStateEvents.length
    )
    assert.equal(
      title + " oncomplete count " + completeEvents.length,
      title + " oncomplete count " + mockCompleteEvents.length
    )
    const mockStateEventsCopy = mockStateEvents.slice()
    for (const { event, state } of stateEvents) {
      const mockEvent = mockStateEventsCopy.shift()
      assert.equal(
        title + " onstatechange state " + state,
        title + " onstatechange state " + mockEvent?.state
      )
      assert.equal(
        title + " onstatechange event type " + event.type,
        title + " onstatechange event type " + event.type
      )
    }
    const mockCompleteEventsCopy = mockCompleteEvents.slice()
    for (const { event } of completeEvents) {
      const mockEvent = mockCompleteEventsCopy.shift()
      assert.equal(
        title + " oncomplete event type " + event.type,
        title + " oncomplete event type " + event.type
      )
      assert.equal(
        title + " oncomplete event constructor name " + event.constructor.name,
        title +
          " oncomplete event constructor name " +
          mockEvent?.event.constructor.name
      )
    }
  }

  const compareAll = (title: string) => {
    compareStates(title)
    compareEventCallbacks(title)
  }

  return {
    compareStates,
    compareEventCallbacks,
    compareAll,
    mockOfflineCtx,
    offlineCtx,
  }
}

export const OFFLINE_AUDIO_CONTEXT_TESTS: RuntimeTest[] = [
  {
    name: "toString",
    test: async ({ offlineCtx, mockOfflineCtx }) => {
      assert.equal(offlineCtx.toString(), mockOfflineCtx.toString())
    },
  },
  {
    name: "constructor",
    test: async () => {
      let ctx = new OfflineAudioContext(1, 1, 44100)
      let mockCtx = new Mock.OfflineAudioContext(1, 1, 44100)
      assert.equal(ctx.length, mockCtx.length)
      assert.equal(ctx.sampleRate, mockCtx.sampleRate)

      ctx = new OfflineAudioContext({
        length: 1,
        numberOfChannels: 1,
        sampleRate: 44100,
      })
      mockCtx = new Mock.OfflineAudioContext({
        length: 1,
        numberOfChannels: 1,
        sampleRate: 44100,
      })
      assert.equal(ctx.length, mockCtx.length)
      assert.equal(ctx.sampleRate, mockCtx.sampleRate)

      ctx = new OfflineAudioContext(2, 2, 48000)
      mockCtx = new Mock.OfflineAudioContext(2, 2, 48000)
      assert.equal(ctx.length, mockCtx.length)
      assert.equal(ctx.sampleRate, mockCtx.sampleRate)

      ctx = new OfflineAudioContext({
        length: 2,
        numberOfChannels: 2,
        sampleRate: 48000,
      })
      mockCtx = new Mock.OfflineAudioContext({
        length: 2,
        numberOfChannels: 2,
        sampleRate: 48000,
      })
      assert.equal(ctx.length, mockCtx.length)
      assert.equal(ctx.sampleRate, mockCtx.sampleRate)

      ctx = new OfflineAudioContext(2, 2, 96000)
      mockCtx = new Mock.OfflineAudioContext(2, 2, 96000)
      assert.equal(ctx.length, mockCtx.length)
      assert.equal(ctx.sampleRate, mockCtx.sampleRate)

      ctx = new OfflineAudioContext({
        length: 2,
        numberOfChannels: 2,
        sampleRate: 96000,
      })
      mockCtx = new Mock.OfflineAudioContext({
        length: 2,
        numberOfChannels: 2,
        sampleRate: 96000,
      })
      assert.equal(ctx.length, mockCtx.length)
      assert.equal(ctx.sampleRate, mockCtx.sampleRate)
    },
  },
  {
    name: "Erroneous constructors",
    test: async () => {
      // number of channels

      compareErrors(
        () => new OfflineAudioContext(0, 1, 44100),
        () => new Mock.OfflineAudioContext(0, 1, 44100),
        "number of channels 0"
      )

      compareErrors(
        () => new OfflineAudioContext(NaN, 1, 44100),
        () => new Mock.OfflineAudioContext(NaN, 1, 44100),
        "number of channels NaN"
      )

      compareErrors(
        () => new OfflineAudioContext(Infinity, 1, 44100),
        () => new Mock.OfflineAudioContext(Infinity, 1, 44100),
        "number of channels Infinity"
      )

      compareErrors(
        () => new OfflineAudioContext(-11, 1, 44100),
        () => new Mock.OfflineAudioContext(-11, 1, 44100),
        "number of channels -11"
      )

      compareErrors(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        () => new OfflineAudioContext("hi", 1, 44100),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        () => new Mock.OfflineAudioContext("hi", 1, 44100),
        "number of channels string"
      )

      // length

      compareErrors(
        () => new OfflineAudioContext(1, 0, 44100),
        () => new Mock.OfflineAudioContext(1, 0, 44100),
        "length 0"
      )

      compareErrors(
        () => new OfflineAudioContext(1, NaN, 44100),
        () => new Mock.OfflineAudioContext(1, NaN, 44100),
        "length NaN"
      )

      compareErrors(
        () => new OfflineAudioContext(1, Infinity, 44100),
        () => new Mock.OfflineAudioContext(1, Infinity, 44100),
        "length Infinity"
      )

      compareErrors(
        () => new OfflineAudioContext(1, -5, 44100),
        () => new Mock.OfflineAudioContext(1, -5, 44100),
        "length -5"
      )

      compareErrors(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        () => new OfflineAudioContext(1, "hi", 44100),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        () => new Mock.OfflineAudioContext(1, "hi", 44100),
        "length string"
      )

      // sample rate

      compareErrors(
        () => new OfflineAudioContext(1, 1, 0),
        () => new Mock.OfflineAudioContext(1, 1, 0),
        "sample rate 0"
      )

      compareErrors(
        () => new OfflineAudioContext(1, 1, NaN),
        () => new Mock.OfflineAudioContext(1, 1, NaN),
        "sample rate NaN"
      )

      compareErrors(
        () => new OfflineAudioContext(1, 1, Infinity),
        () => new Mock.OfflineAudioContext(1, 1, Infinity),
        "sample rate Infinity"
      )

      compareErrors(
        () => new OfflineAudioContext(1, 1, -1),
        () => new Mock.OfflineAudioContext(1, 1, -1),
        "sample rate -1"
      )

      compareErrors(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        () => new OfflineAudioContext(1, 1, "hi"),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        () => new Mock.OfflineAudioContext(1, 1, "hi"),
        "sample rate string"
      )

      // mixed errors
      compareErrors(
        () => new OfflineAudioContext(0, 0, 0),
        () => new Mock.OfflineAudioContext(0, 0, 0),
        "number of channels 0, length 0, sample rate 0"
      )

      compareErrors(
        () => new OfflineAudioContext(0, 0, NaN),
        () => new Mock.OfflineAudioContext(0, 0, NaN),
        "number of channels 0, length 0, sample rate NaN"
      )

      compareErrors(
        () => new OfflineAudioContext(-1, -1, Infinity),
        () => new Mock.OfflineAudioContext(-1, -1, Infinity),
        "number of channels -1, length -1, sample rate Infinity"
      )

      compareErrors(
        () => new OfflineAudioContext(Infinity, Infinity, -1),
        () => new Mock.OfflineAudioContext(Infinity, Infinity, -1),
        "number of channels Infinity, length Infinity, sample rate -1"
      )

      compareErrors(
        () =>
          new OfflineAudioContext(
            -1,
            0,
            getEngineContext(this).deviceSettings.minSampleRate
          ),
        () =>
          new Mock.OfflineAudioContext(
            -1,
            0,
            getEngineContext(this).deviceSettings.minSampleRate
          ),
        "number of channels -1, length 0, sample rate getGlobalDeviceSetting('minSampleRate')"
      )
    },
  },
  {
    name: "startRendering",
    test: async () => {
      const { compareStates, offlineCtx, mockOfflineCtx } = createStateUtils(
        new OfflineAudioContext(1, 48_000 * 10, 48_000),
        new Mock.OfflineAudioContext(1, 48_000 * 10, 48_000)
      )

      compareStates("init")

      const buffer = await offlineCtx.startRendering()
      const mockBuffer = await mockOfflineCtx.startRendering()

      compareStates("postRenderPromise")

      assert.equal(buffer.length, mockBuffer.length)
      assert.equal(buffer.sampleRate, mockBuffer.sampleRate)
      assert.equal(buffer.constructor.name, mockBuffer.constructor.name)
      assert.equal(buffer.numberOfChannels, mockBuffer.numberOfChannels)
      assert.equal(buffer.duration, mockBuffer.duration)
      assert.equal(
        buffer.getChannelData(0).length,
        mockBuffer.getChannelData(0).length
      )
    },
  },
  {
    name: "Suspend 0 before rendering",
    test: async () => {
      const { compareAll, offlineCtx, mockOfflineCtx } = createStateUtils(
        new OfflineAudioContext(1, 48_000 * 10, 48_000),
        new Mock.OfflineAudioContext(1, 48_000 * 10, 48_000)
      )

      compareAll("init")

      const suspendPromise = offlineCtx.suspend(0)
      const mockSuspendPromise = mockOfflineCtx.suspend(0)

      const renderPromise = offlineCtx.startRendering()
      const mockRenderPromise = mockOfflineCtx.startRendering()

      await delay(100)

      compareAll("startRendering")

      await offlineCtx.resume()
      await mockOfflineCtx.resume()

      await suspendPromise
      await mockSuspendPromise

      await delay(100)

      compareAll("postResume")

      await renderPromise
      await mockRenderPromise

      compareAll("postRenderPromise")
    },
  },
  {
    name: "Suspend non-0 time before rendering",
    test: async () => {
      const { compareAll, offlineCtx, mockOfflineCtx } = createStateUtils(
        new OfflineAudioContext(1, 48_000 * 10, 48_000),
        new Mock.OfflineAudioContext(1, 48_000 * 10, 48_000)
      )

      compareAll("init")

      const suspendPromise = offlineCtx.suspend(5)
      const mockSuspendPromise = mockOfflineCtx.suspend(5)

      const renderPromise = offlineCtx.startRendering()
      const mockRenderPromise = mockOfflineCtx.startRendering()

      await delay(100)

      compareAll("startRendering")

      await offlineCtx.resume()
      await mockOfflineCtx.resume()

      await delay(100)

      compareAll("postResume")

      await suspendPromise
      await mockSuspendPromise

      await delay(100)

      compareAll("postSuspendPromise")

      await renderPromise
      await mockRenderPromise

      compareAll("postRenderPromise")
    },
  },
  {
    name: "Multiple suspends",
    test: async () => {
      const { compareAll, offlineCtx, mockOfflineCtx } = createStateUtils(
        new OfflineAudioContext(1, 48_000 * 10, 48_000),
        new Mock.OfflineAudioContext(1, 48_000 * 10, 48_000)
      )

      compareAll("init")

      const suspendA = offlineCtx.suspend(1.5)
      const mockSuspendA = mockOfflineCtx.suspend(1.5)

      const suspendB = offlineCtx.suspend(2.5)
      const mockSuspendB = mockOfflineCtx.suspend(2.2)

      const renderPromise = offlineCtx.startRendering()
      const mockRenderPromise = mockOfflineCtx.startRendering()

      await delay(100)

      compareAll("startRendering")

      await offlineCtx.resume()
      await mockOfflineCtx.resume()

      await delay(100)

      compareAll("postResume")

      await offlineCtx.resume()
      await mockOfflineCtx.resume()

      await suspendA
      await mockSuspendA

      await delay(100)

      compareAll("postSuspendA")

      await suspendB
      await mockSuspendB

      await delay(100)

      compareAll("postSuspendB")

      await renderPromise
      await mockRenderPromise

      compareAll("postRenderPromise")
    },
  },
  {
    name: "Suspend errors",
    test: async () => {
      const { compareAll, offlineCtx, mockOfflineCtx } = createStateUtils(
        new OfflineAudioContext(1, 48_000 * 10, 48_000),
        new Mock.OfflineAudioContext(1, 48_000 * 10, 48_000)
      )

      compareAll("init")

      compareErrors(
        () => offlineCtx.suspend(-1),
        () => mockOfflineCtx.suspend(-1),
        "negative time"
      )
      compareErrors(
        () => offlineCtx.suspend(1_000_000),
        () => mockOfflineCtx.suspend(1_000_000),
        "time > context length"
      )
      compareErrors(
        () => offlineCtx.suspend(Infinity),
        () => mockOfflineCtx.suspend(Infinity),
        "Infinity"
      )
      compareErrors(
        () => offlineCtx.suspend(NaN),
        () => mockOfflineCtx.suspend(NaN),
        "NaN"
      )

      /* eslint-disable @typescript-eslint/ban-ts-comment */
      compareErrors(
        // @ts-ignore
        () => offlineCtx.suspend("hi"),
        // @ts-ignore
        () => mockOfflineCtx.suspend("hi"),
        "string"
      )
      compareErrors(
        // @ts-ignore
        () => offlineCtx.suspend(),
        // @ts-ignore
        () => mockOfflineCtx.suspend(),
        "no args"
      )
      /* eslint-enable @typescript-eslint/ban-ts-comment */

      offlineCtx.suspend(0)
      mockOfflineCtx.suspend(0)

      compareErrors(
        () => offlineCtx.suspend(0),
        () => mockOfflineCtx.suspend(0),
        "suspended 0 twice"
      )

      offlineCtx.suspend(5)
      mockOfflineCtx.suspend(5)

      compareErrors(
        () => offlineCtx.suspend(5),
        () => mockOfflineCtx.suspend(5),
        "suspended 5 twice"
      )

      const renderPromise = offlineCtx.startRendering()
      const mockRenderPromise = mockOfflineCtx.startRendering()

      await delay(100)

      await offlineCtx.resume()
      await mockOfflineCtx.resume()

      await delay(100)

      compareErrors(
        () => offlineCtx.suspend(0),
        () => mockOfflineCtx.suspend(0),
        "suspended 0 after resume"
      )
      compareErrors(
        () => offlineCtx.suspend(1),
        () => mockOfflineCtx.suspend(1),
        "suspended 1 after resume"
      )
      compareErrors(
        () => offlineCtx.suspend(4),
        () => mockOfflineCtx.suspend(4),
        "suspended 4 after resume"
      )
      compareErrors(
        () => offlineCtx.suspend(5),
        () => mockOfflineCtx.suspend(5),
        "suspended 5 after resume"
      )

      await offlineCtx.resume()
      await mockOfflineCtx.resume()

      await delay(100)

      await offlineCtx.resume()
      await mockOfflineCtx.resume()

      await delay(100)

      await renderPromise
      await mockRenderPromise

      compareErrors(
        () => offlineCtx.suspend(0),
        () => mockOfflineCtx.suspend(0),
        "suspended 0 after render"
      )
      compareErrors(
        () => offlineCtx.suspend(1),
        () => mockOfflineCtx.suspend(1),
        "suspended 1 after render"
      )
    },
  },
  {
    name: "Resume errors",
    test: async () => {
      const { compareAll, offlineCtx, mockOfflineCtx } = createStateUtils(
        new OfflineAudioContext(1, 48_000 * 10, 48_000),
        new Mock.OfflineAudioContext(1, 48_000 * 10, 48_000)
      )

      compareAll("init")

      compareErrors(
        () => offlineCtx.resume(),
        () => mockOfflineCtx.resume(),
        "before render"
      )

      offlineCtx.suspend(0)
      mockOfflineCtx.suspend(0)

      offlineCtx.startRendering()
      mockOfflineCtx.startRendering()

      await delay(100)

      offlineCtx.resume()
      mockOfflineCtx.resume()

      await delay(100)

      compareErrors(
        () => offlineCtx.resume(),
        () => mockOfflineCtx.resume(),
        "after resume"
      )
    },
  },
  {
    name: "startRendering errors",
    test: async () => {
      const { compareAll, offlineCtx, mockOfflineCtx } = createStateUtils(
        new OfflineAudioContext(1, 48_000 * 10, 48_000),
        new Mock.OfflineAudioContext(1, 48_000 * 10, 48_000)
      )

      compareAll("init")

      offlineCtx.suspend(0)
      mockOfflineCtx.suspend(0)

      offlineCtx.startRendering()
      mockOfflineCtx.startRendering()

      await delay(100)

      compareErrors(
        () => offlineCtx.startRendering(),
        () => mockOfflineCtx.startRendering(),
        "after render"
      )

      offlineCtx.resume()
      mockOfflineCtx.resume()

      await delay(100)

      compareErrors(
        () => offlineCtx.startRendering(),
        () => mockOfflineCtx.startRendering(),
        "after resume"
      )
    },
  },
]
