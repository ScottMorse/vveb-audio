import { strict as assert } from "assert"
import { delay } from "@@core/internal/testing/delay"
import { almostEqual } from "@@core/internal/util/number/almostEqual"
import { ALL_AUDIO_NODES } from "@@core/native/audioNode/audioNodes"
import { appLogger } from "../../lib/logger"
import { Mock } from "../../lib/mock"
import { compareErrors } from "../../lib/util"
import { RuntimeTest } from "../runtimeTest"
import { createAudioNodesTestConfig } from "./testAudioNodesConfig"

export const AUDIO_CONTEXT_TESTS: RuntimeTest[] = [
  {
    name: "toString",
    test: async () => {
      const ctx = new AudioContext()
      const mockCtx = new Mock.AudioContext()
      assert.equal(ctx.toString(), mockCtx.toString())
    },
  },
  {
    name: "baseLatency",
    test: async () => {
      const ctx = new AudioContext()
      const mockCtx = new Mock.AudioContext()
      appLogger.debug("baseLatency", {
        baseLatency: ctx.baseLatency,
        mockBaseLatency: mockCtx.baseLatency,
      })
      assert.equal(typeof ctx.baseLatency, typeof mockCtx.baseLatency)
    },
  },
  {
    name: "outputLatency",
    test: async () => {
      const ctx = new AudioContext()
      const mockCtx = new Mock.AudioContext()
      appLogger.debug("outputLatency", {
        outputLatency: ctx.outputLatency,
        mockOutputLatency: mockCtx.outputLatency,
      })
      assert.equal(typeof ctx.outputLatency, typeof mockCtx.outputLatency)
    },
  },
  {
    name: "audioWorklet",
    test: async () => {
      const ctx = new AudioContext()
      const mockCtx = new Mock.AudioContext()
      appLogger.debug("audioWorklet", {
        audioWorklet: ctx.audioWorklet,
        mockAudioWorklet: mockCtx.audioWorklet,
      })
      assert.equal(
        ctx.audioWorklet.constructor.name,
        mockCtx.audioWorklet.constructor.name
      )
    },
  },
  {
    name: "destination",
    test: async () => {
      const ctx = new AudioContext()
      const mockCtx = new Mock.AudioContext()
      appLogger.debug("destination", {
        destination: ctx.destination,
        mockDestination: mockCtx.destination,
      })
      assert.equal(
        "maxChannelCount " + typeof ctx.destination.maxChannelCount,
        "maxChannelCount " + typeof ctx.destination.maxChannelCount
      )
      // please rewrite assertions above the previous to use the same kind of string prefixes
      assert.equal(
        "numberOfInputs " + ctx.destination.numberOfInputs,
        "numberOfInputs " + mockCtx.destination.numberOfInputs
      )
      assert.equal(
        "numberOfOutputs " + ctx.destination.numberOfOutputs,
        "numberOfOutputs " + mockCtx.destination.numberOfOutputs
      )
      assert.equal(
        "channelCount " + ctx.destination.channelCount,
        "channelCount " + mockCtx.destination.channelCount
      )
      assert.equal(
        "channelCountMode " + ctx.destination.channelCountMode,
        "channelCountMode " + mockCtx.destination.channelCountMode
      )
      assert.equal(
        "channelInterpretation " + ctx.destination.channelInterpretation,
        "channelInterpretation " + mockCtx.destination.channelInterpretation
      )

      assert.equal(ctx.destination.context, ctx)
      assert.equal(mockCtx.destination.context, mockCtx)
    },
  },
  {
    name: "listener",
    test: async () => {
      const ctx = new AudioContext()
      const mockCtx = new Mock.AudioContext()
      appLogger.debug("listener", {
        listener: ctx.listener,
        mockListener: mockCtx.listener,
      })
      assert.equal(
        ctx.listener.constructor.name,
        mockCtx.listener.constructor.name
      )
    },
  },
  {
    name: "currentTime and getOutputTimestamp",
    test: async () => {
      const ctx = new AudioContext()
      const mockCtx = new Mock.AudioContext()
      appLogger.debug("currentTime", {
        currentTime: ctx.currentTime,
        mockCurrentTime: mockCtx.currentTime,
        outputTimestamp: ctx.getOutputTimestamp(),
        mockOutputTimestamp: mockCtx.getOutputTimestamp(),
      })

      const runAssertions = () => {
        try {
          assert.equal(
            almostEqual(ctx.currentTime, mockCtx.currentTime, 1),
            true
          )
        } catch (e) {
          throw new Error(
            `Current time is not close. ctx.currentTime: ${ctx.currentTime}, mockCtx.currentTime: ${mockCtx.currentTime}`
          )
        }
        try {
          assert.equal(
            almostEqual(
              ctx.getOutputTimestamp().contextTime ?? -1,
              mockCtx.getOutputTimestamp().contextTime ?? -1,
              1
            ),
            true
          )
        } catch (e) {
          throw new Error(
            `Output timestamp is not close. ctx.getOutputTimestamp().contextTime: ${
              ctx.getOutputTimestamp().contextTime
            }, mockCtx.getOutputTimestamp().contextTime: ${
              mockCtx.getOutputTimestamp().contextTime
            }`
          )
        }
        // again with performance time
        try {
          assert.equal(
            almostEqual(
              ctx.getOutputTimestamp().performanceTime ?? -1,
              mockCtx.getOutputTimestamp().performanceTime ?? -1,
              1500
            ),
            true
          )
        } catch (e) {
          throw new Error(
            `Output timestamp is not close. ctx.getOutputTimestamp().performanceTime: ${
              ctx.getOutputTimestamp().performanceTime
            }, mockCtx.getOutputTimestamp().performanceTime: ${
              mockCtx.getOutputTimestamp().performanceTime
            }`
          )
        }
        assert.equal(typeof ctx.currentTime, typeof mockCtx.currentTime)
      }

      runAssertions()
      try {
        await ctx.suspend()
        await mockCtx.suspend()
      } catch (error) {
        appLogger.warn("Could not suspend", { error })
      }

      await delay(2000)

      runAssertions()
      try {
        await ctx.resume()
        await mockCtx.resume()
      } catch (error) {
        appLogger.warn("Could not resume", { error })
      }

      await delay(2000)

      runAssertions()
    },
  },
  {
    name: "sampleRate",
    test: async () => {
      let ctx = new AudioContext()
      let mockCtx = new Mock.AudioContext()
      appLogger.debug("sampleRate", {
        sampleRate: ctx.sampleRate,
        mockSampleRate: mockCtx.sampleRate,
      })
      assert.equal(ctx.sampleRate, mockCtx.sampleRate)

      ctx = new AudioContext({ sampleRate: 12345 })
      mockCtx = new Mock.AudioContext({ sampleRate: 12345 })
      appLogger.debug("sampleRate", {
        sampleRate: ctx.sampleRate,
        mockSampleRate: mockCtx.sampleRate,
      })
      assert.equal(ctx.sampleRate, mockCtx.sampleRate)
    },
  },
  {
    name: "state, resume, suspend, close",
    test: async () => {
      const ctx = new AudioContext()
      const mockCtx = new Mock.AudioContext()
      appLogger.debug("state", {
        state: ctx.state,
        mockState: mockCtx.state,
      })

      let listenerRuns = 0
      let mockListenerRuns = 0
      let lastListenerEvent = null as Event | null
      let lastMockListenerEvent = null as Event | null
      ctx.onstatechange = (e) => {
        listenerRuns++
        lastListenerEvent = e
      }
      mockCtx.onstatechange = (e) => {
        mockListenerRuns++
        lastMockListenerEvent = e
      }

      const checkMethod = async (method: "resume" | "suspend" | "close") => {
        let ctxError: Error | null = null
        let mockCtxError: Error | null = null

        let promise: Promise<void> | null = null
        let mockPromise: Promise<void> | null = null
        try {
          promise = ctx[method]()
        } catch (e) {
          ctxError = e as Error
        }

        try {
          mockPromise = mockCtx[method]()
        } catch (e) {
          mockCtxError = e as Error
        }
        assert.equal(ctx.state, mockCtx.state)
        assert.equal(ctxError?.message, mockCtxError?.message)

        try {
          await promise
        } catch (e) {
          ctxError = e as Error
        }
        try {
          await mockPromise
        } catch (e) {
          mockCtxError = e as Error
        }
        assert.equal(ctx.state, mockCtx.state)
        assert.equal(ctxError?.message, mockCtxError?.message)
        await delay(250)
        assert.equal(listenerRuns, mockListenerRuns)
        assert.equal(lastListenerEvent?.type, lastMockListenerEvent?.type)
      }

      assert.equal(ctx.state, mockCtx.state)
      assert.equal(listenerRuns, mockListenerRuns)
      assert.equal(lastListenerEvent?.type, lastMockListenerEvent?.type)

      await checkMethod("resume")
      await checkMethod("suspend")
      await checkMethod("resume")
      await checkMethod("close")
      await checkMethod("resume")
      await checkMethod("suspend")
      await checkMethod("close")
    },
  },
  {
    name: "Erroneous sampleRate in constructor",
    test: async () => {
      /* eslint-disable @typescript-eslint/ban-ts-comment */

      compareErrors(
        () =>
          new AudioContext({
            sampleRate: Infinity,
          }),
        () =>
          new Mock.AudioContext({
            sampleRate: Infinity,
          }),
        "sampleRate is Infinity"
      )

      compareErrors(
        () =>
          new AudioContext({
            sampleRate: -Infinity,
          }),
        () =>
          new Mock.AudioContext({
            sampleRate: -Infinity,
          }),
        "sampleRate is -Infinity"
      )

      compareErrors(
        () =>
          new AudioContext({
            sampleRate: NaN,
          }),
        () =>
          new Mock.AudioContext({
            sampleRate: NaN,
          }),
        "sampleRate is NaN"
      )

      compareErrors(
        () =>
          new AudioContext({
            sampleRate: undefined,
          }),
        () =>
          new Mock.AudioContext({
            sampleRate: undefined,
          }),
        "sampleRate is undefined"
      )

      compareErrors(
        () =>
          new AudioContext({
            // @ts-ignore
            sampleRate: null,
          }),
        () =>
          new Mock.AudioContext({
            // @ts-ignore
            sampleRate: null,
          }),
        "sampleRate is null"
      )

      compareErrors(
        () =>
          new AudioContext({
            // @ts-ignore
            sampleRate: "string",
          }),
        () =>
          new Mock.AudioContext({
            // @ts-ignore
            sampleRate: "string",
          }),
        "sampleRate is string"
      )

      compareErrors(
        () =>
          new AudioContext({
            // @ts-ignore
            sampleRate: {},
          }),
        () =>
          new Mock.AudioContext({
            // @ts-ignore
            sampleRate: {},
          }),
        "sampleRate is object"
      )

      /* eslint-enable @typescript-eslint/ban-ts-comment */
    },
  },
  {
    name: "Erroneous latencyHint in constructor",
    test: async () => {
      /* eslint-disable @typescript-eslint/ban-ts-comment */

      compareErrors(
        () =>
          new AudioContext({
            latencyHint: Infinity,
          }),
        () =>
          new Mock.AudioContext({
            latencyHint: Infinity,
          }),
        "latencyHint is Infinity"
      )

      compareErrors(
        () =>
          new AudioContext({
            latencyHint: -Infinity,
          }),
        () =>
          new Mock.AudioContext({
            latencyHint: -Infinity,
          }),
        "latencyHint is -Infinity"
      )

      compareErrors(
        () =>
          new AudioContext({
            latencyHint: NaN,
          }),
        () =>
          new Mock.AudioContext({
            latencyHint: NaN,
          }),
        "latencyHint is NaN"
      )

      compareErrors(
        () =>
          new AudioContext({
            // @ts-ignore
            latencyHint: "string",
          }),
        () =>
          new Mock.AudioContext({
            // @ts-ignore
            latencyHint: "string",
          }),
        "latencyHint is string"
      )

      compareErrors(
        () =>
          new AudioContext({
            // @ts-ignore
            latencyHint: {},
          }),
        () =>
          new Mock.AudioContext({
            // @ts-ignore
            latencyHint: {},
          }),
        "latencyHint is object"
      )

      compareErrors(
        () =>
          new AudioContext({
            latencyHint: Number.MIN_SAFE_INTEGER,
          }),
        () =>
          new Mock.AudioContext({
            latencyHint: Number.MIN_SAFE_INTEGER,
          }),
        "latencyHint is Number.MIN_SAFE_INTEGER"
      )

      compareErrors(
        () =>
          new AudioContext({
            latencyHint: Number.MAX_SAFE_INTEGER,
          }),
        () =>
          new Mock.AudioContext({
            latencyHint: Number.MAX_SAFE_INTEGER,
          }),
        "latencyHint is Number.MAX_SAFE_INTEGER"
      )

      compareErrors(
        () =>
          new AudioContext({
            latencyHint: "balanced",
          }),
        () =>
          new Mock.AudioContext({
            latencyHint: "balanced",
          }),
        "latencyHint is balanced"
      )

      compareErrors(
        () =>
          new AudioContext({
            latencyHint: "interactive",
          }),
        () =>
          new Mock.AudioContext({
            latencyHint: "interactive",
          }),
        "latencyHint is interactive"
      )

      compareErrors(
        () =>
          new AudioContext({
            latencyHint: "playback",
          }),
        () =>
          new Mock.AudioContext({
            latencyHint: "playback",
          }),
        "latencyHint is playback"
      )

      /* eslint-enable @typescript-eslint/ban-ts-comment */
    },
  },
  {
    name: "createPeriodicWave",
    test: async () => {
      const ctx = new AudioContext()
      const mockCtx = new Mock.AudioContext()
      const ctxWave = ctx.createPeriodicWave(
        new Float32Array([1, 2, 3]),
        new Float32Array([4, 5, 6])
      )
      const mockCtxWave = mockCtx.createPeriodicWave(
        new Float32Array([1, 2, 3]),
        new Float32Array([4, 5, 6])
      )

      assert.equal(ctxWave.constructor.name, mockCtxWave.constructor.name)

      appLogger.debug("createPeriodicWave", {
        ctxWave,
        mockCtxWave,
      })

      /* eslint-disable @typescript-eslint/ban-ts-comment */
      compareErrors(
        // @ts-ignore
        () => ctx.createPeriodicWave(),
        // @ts-ignore
        () => mockCtx.createPeriodicWave(),
        "no arguments"
      )
      compareErrors(
        // @ts-ignore
        () => ctx.createPeriodicWave([]),
        // @ts-ignore
        () => mockCtx.createPeriodicWave([]),
        "empty array"
      )
      compareErrors(
        // @ts-ignore
        () => ctx.createPeriodicWave(["hi"]),
        // @ts-ignore
        () => mockCtx.createPeriodicWave(["hi"]),
        "string array"
      )
      compareErrors(
        // @ts-ignore
        () => ctx.createPeriodicWave("hi"),
        // @ts-ignore
        () => mockCtx.createPeriodicWave("hi"),
        "string"
      )
      compareErrors(
        // @ts-ignore
        () => ctx.createPeriodicWave([1, 2], ["hi"]),
        // @ts-ignore
        () => mockCtx.createPeriodicWave([1, 2], ["hi"]),
        "string in second array"
      )
      compareErrors(
        // @ts-ignore
        () => ctx.createPeriodicWave([1, 2], ["hi", "hi"]),
        // @ts-ignore
        () => mockCtx.createPeriodicWave([1, 2], ["hi", "hi"]),
        "string in both arrays"
      )
      /* eslint-enable @typescript-eslint/ban-ts-comment */

      compareErrors(
        () => ctx.createPeriodicWave([], []),
        () => mockCtx.createPeriodicWave([], []),
        "empty arrays"
      )
      compareErrors(
        () => ctx.createPeriodicWave(new Float32Array([1]), []),
        () => mockCtx.createPeriodicWave(new Float32Array([1]), []),
        "empty second array"
      )
      compareErrors(
        () => ctx.createPeriodicWave([], new Float32Array([1])),
        () => mockCtx.createPeriodicWave([], new Float32Array([1])),
        "empty first array"
      )
      compareErrors(
        () =>
          ctx.createPeriodicWave(new Float32Array([1]), new Float32Array([1])),
        () =>
          mockCtx.createPeriodicWave(
            new Float32Array([1]),
            new Float32Array([1])
          ),
        "same length arrays"
      )
      compareErrors(
        () =>
          ctx.createPeriodicWave(
            new Float32Array([1, 2]),
            new Float32Array([1])
          ),
        () =>
          mockCtx.createPeriodicWave(
            new Float32Array([1, 2]),
            new Float32Array([1])
          ),
        "first array longer"
      )
      compareErrors(
        () =>
          ctx.createPeriodicWave(
            new Float32Array([1]),
            new Float32Array([1, 2])
          ),
        () =>
          mockCtx.createPeriodicWave(
            new Float32Array([1]),
            new Float32Array([1, 2])
          ),
        "second array longer"
      )
      compareErrors(
        () =>
          ctx.createPeriodicWave(
            new Float32Array([1, 2]),
            new Float32Array([1, 2])
          ),
        () =>
          mockCtx.createPeriodicWave(
            new Float32Array([1, 2]),
            new Float32Array([1, 2])
          ),
        "same length arrays"
      )
    },
  },
  {
    name: "Audio node methods",
    test: async () => {
      const ctx = new AudioContext()
      const mockCtx = new Mock.AudioContext()
      Object.entries(createAudioNodesTestConfig()).forEach(([name, node]) => {
        const meta = ALL_AUDIO_NODES[name as keyof typeof ALL_AUDIO_NODES]

        if (meta.contextMethod) {
          const ctxNode = (ctx as any)[meta.contextMethod](
            ...(node.contextMethodArgs as any[])
          )
          const mockCtxNode = (mockCtx as any)[meta.contextMethod](
            ...(node.contextMethodArgs as any[])
          )
          appLogger.debug(`AudioContext ${meta.contextMethod}`, {
            ctxNode,
            mockCtxNode,
          })

          const isAudioParam = (value: any): value is AudioParam =>
            value?.constructor?.name === "AudioParam"

          const compareProp = (prop: keyof AudioNode) => {
            const value = ctxNode[prop]
            const mockValue = mockCtxNode[prop]
            const prefix = meta.constructorName + " " + prop
            if (isAudioParam(value)) {
              assert.equal(
                prefix + " value " + value.value,
                prefix + " value " + mockValue.value
              )
              assert.equal(
                prefix + " defaultValue " + value.defaultValue,
                prefix + " defaultValue " + mockValue.defaultValue
              )

              assert.equal(
                prefix + " minValue " + value.minValue,
                prefix + " minValue " + mockValue.minValue
              )

              assert.equal(
                prefix + " maxValue " + value.maxValue,
                prefix + " maxValue " + mockValue.maxValue
              )

              assert.equal(
                prefix + " automationRate " + value.automationRate,
                prefix + " automationRate " + mockValue.automationRate
              )
            } else {
              assert.equal(prefix + value, prefix + mockValue)
            }
          }

          assert.equal(ctxNode.constructor.name, mockCtxNode.constructor.name)
          compareProp("channelCount")
          compareProp("channelCountMode")
          compareProp("channelInterpretation")
          compareProp("numberOfInputs")
          compareProp("numberOfOutputs")
          for (const prop of node.comparisonProperties) {
            compareProp(prop as any)
          }
          ctxNode.disconnect()
          mockCtxNode.disconnect()
        }
      })
    },
  },
]
