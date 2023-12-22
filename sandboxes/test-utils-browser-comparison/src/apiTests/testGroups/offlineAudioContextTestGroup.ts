import { strict as assert } from "assert"
import { delay } from "@@core/internal/testing/delay"
import { appLogger } from "src/lib/logger"
import {
  compareClass,
  createCommonNumberTestArgs,
  createMissingArgs,
  createVariedTypeArgs,
} from "src/lib/testUtils"
import { compareErrors } from "src/lib/util"
import { TestGroupConfig } from "../testGroupConfig"

/**
 * @todo This is logic from first test implementation.
 * This whole file needs review for refactoring
 * */
const createStateUtils = (
  offlineCtx: OfflineAudioContext,
  mockOfflineCtx: OfflineAudioContext
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

export const OFFLINE_AUDIO_CONTEXT_TEST_GROUP: TestGroupConfig = {
  name: "OfflineAudioContext",
  tests: {
    compareClass: {
      name: "Compare class",
      run: ({ mockWebAudio }) => {
        return compareClass({
          real: OfflineAudioContext,
          mock: mockWebAudio.api.OfflineAudioContext,
          name: "Mock OfflineAudioContext",
          constructorArgLists: [
            {
              args: [0, 1, 2],
              name: "new OfflineAudioContext(0,1,2)",
            },
            {
              args: [3, 4, 5],
              name: "new OfflineAudioContext(3,4,5)",
            },
            {
              args: [1, 1, 44100],
              name: "new OfflineAudioContext(1,1,44100)",
            },
            {
              args: [24, 15, 48000],
              name: "new OfflineAudioContext(24,15,48000)",
            },
            {
              args: [{ length: 0, numberOfChannels: 1, sampleRate: 2 }],
              name: "new OfflineAudioContext({ length: 0, numberOfChannels: 1, sampleRate: 2 })",
            },
            {
              args: [{ length: 3, numberOfChannels: 4, sampleRate: 5 }],
              name: "new OfflineAudioContext({ length: 3, numberOfChannels: 4, sampleRate: 5 })",
            },
            {
              args: [{ length: 1, numberOfChannels: 1, sampleRate: 44100 }],
              name: "new OfflineAudioContext({ length: 1, numberOfChannels: 1, sampleRate: 44100 })",
            },
            {
              args: [{ length: 24, numberOfChannels: 15, sampleRate: 48000 }],
              name: "new OfflineAudioContext({ length: 24, numberOfChannels: 15, sampleRate: 48000 })",
            },
            ...createCommonNumberTestArgs<{
              args: [number, number, number] | [OfflineAudioContextOptions]
              name: string
            }>((x) => {
              const baseArgs = [
                {
                  args: [x, 10, 44100],
                  name: `new OfflineAudioContext(${x}, 10, 44100)`,
                },
                {
                  args: [10, x, 44100],
                  name: `new OfflineAudioContext(10, ${x}, 44100)`,
                },
                {
                  args: [10, 10, x],
                  name: `new OfflineAudioContext(10, 10, ${x})`,
                },
                {
                  args: [10, x, x],
                  name: `new OfflineAudioContext(10, ${x}, ${x})`,
                },

                {
                  args: [x, 10, x],
                  name: `new OfflineAudioContext(${x}, 10, ${x})`,
                },
                {
                  args: [x, x, 44100],
                  name: `new OfflineAudioContext(${x}, ${x}, 44100)`,
                },
                {
                  args: [x, x, x],
                  name: `new OfflineAudioContext(${x}, ${x}, ${x})`,
                },
              ]

              return (
                baseArgs as {
                  args: [number, number, number] | [OfflineAudioContextOptions]
                  name: string
                }[]
              ).concat(
                baseArgs.map(
                  ({ args: [length, numberOfChannels, sampleRate] }) => ({
                    args: [{ length, numberOfChannels, sampleRate }],
                    name: `new OfflineAudioContext({ length: ${length}, numberOfChannels: ${numberOfChannels}, sampleRate: ${sampleRate} })`,
                  })
                )
              )
            }),
          ],
          errorConstructorArgLists: [
            ...createMissingArgs(
              (args) => ({
                args,
                name: `OfflineAudioContext args length ${args.length}`,
              }),
              [1, 1, 44100]
            ),
            ...createVariedTypeArgs(
              (args) => ({
                args,
                name: `OfflineAudioContext args ${args.join(",")}`,
              }),
              [{ length: 1, numberOfChannels: 1, sampleRate: 44100 }]
            ),
            ...createVariedTypeArgs(
              (args) => ({
                args,
                name: `OfflineAudioContext args ${args.join(",")}`,
              }),
              [1, 1, 44100]
            ),
          ],
        })
      },
    },
    startRendering: {
      name: "startRendering",
      run: async ({ mockWebAudio }) => {
        const { compareStates, offlineCtx, mockOfflineCtx } = createStateUtils(
          new OfflineAudioContext(1, 48_000 * 10, 48_000),
          new mockWebAudio.api.OfflineAudioContext(1, 48_000 * 10, 48_000)
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

        return { errors: [] }
      },
    },
    suspend0PreRender: {
      name: "suspend(0) pre-render",
      run: async ({ mockWebAudio }) => {
        const { compareAll, offlineCtx, mockOfflineCtx } = createStateUtils(
          new OfflineAudioContext(1, 48_000 * 10, 48_000),
          new mockWebAudio.api.OfflineAudioContext(1, 48_000 * 10, 48_000)
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

        return { errors: [] }
      },
    },
    suspendNon0PreRender: {
      name: "suspend(non-0) pre-render",
      run: async ({ mockWebAudio }) => {
        const { compareAll, offlineCtx, mockOfflineCtx } = createStateUtils(
          new OfflineAudioContext(1, 48_000 * 10, 48_000),
          new mockWebAudio.api.OfflineAudioContext(1, 48_000 * 10, 48_000)
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

        return { errors: [] }
      },
    },
    multipleSuspends: {
      name: "multiple suspends",
      run: async ({ mockWebAudio }) => {
        const { compareAll, offlineCtx, mockOfflineCtx } = createStateUtils(
          new OfflineAudioContext(1, 48_000 * 10, 48_000),
          new mockWebAudio.api.OfflineAudioContext(1, 48_000 * 10, 48_000)
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

        return { errors: [] }
      },
    },
    suspendErrors: {
      name: "suspend errors",
      run: async ({ mockWebAudio }) => {
        const { compareAll, offlineCtx, mockOfflineCtx } = createStateUtils(
          new OfflineAudioContext(1, 48_000 * 10, 48_000),
          new mockWebAudio.api.OfflineAudioContext(1, 48_000 * 10, 48_000)
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

        return { errors: [] }
      },
    },
    resumeErrors: {
      name: "resume() errors",
      run: async ({ mockWebAudio }) => {
        const { compareAll, offlineCtx, mockOfflineCtx } = createStateUtils(
          new OfflineAudioContext(1, 48_000 * 10, 48_000),
          new mockWebAudio.api.OfflineAudioContext(1, 48_000 * 10, 48_000)
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
        return { errors: [] }
      },
    },
    startRenderingErrors: {
      name: "startRendering() errors",
      run: async ({ mockWebAudio }) => {
        const { compareAll, offlineCtx, mockOfflineCtx } = createStateUtils(
          new OfflineAudioContext(1, 48_000 * 10, 48_000),
          new mockWebAudio.api.OfflineAudioContext(1, 48_000 * 10, 48_000)
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
        return { errors: [] }
      },
    },
  },
}
