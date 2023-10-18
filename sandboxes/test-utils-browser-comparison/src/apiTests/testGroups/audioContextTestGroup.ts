import { strict as assert } from "assert"
import { delay } from "@@core/internal/testing/delay"
import { almostEqual } from "@@core/internal/util/number/almostEqual"
import { AUDIO_NODES } from "@@core/webAudio/types"
import round from "lodash/round"
import { appLogger } from "src/lib/logger"
import {
  compareClass,
  compareInstance,
  createCommonNumberTestArgs,
  createMissingArgs,
  createVariedTypeArgs,
} from "src/lib/testUtils"
import { TestGroupConfig } from "../testGroupConfig"
import { createAudioNodesTestConfig } from "./testAudioNodesConfig"

const safeClose = (ctx: AudioContext) => {
  try {
    ctx.close()
  } catch (error) {
    // ignore
  }
}

export const AUDIO_CONTEXT_TEST_GROUP: TestGroupConfig = {
  name: "AudioContext(/BaseAudioContext)",
  tests: {
    compareClass: {
      name: "Compare class",
      run: ({ mockWebAudio }) => {
        return compareClass({
          real: AudioContext,
          mock: mockWebAudio.api.AudioContext,
          name: "Mock AudioContext",
          constructorArgLists: [
            {
              args: [],
              name: "No args",
            },
            {
              args: [{ sampleRate: 48000 }],
              name: "Sample rate 48K",
            },
            {
              args: [{ sampleRate: 44100 }],
              name: "Sample rate 44.1K",
            },
            ...createCommonNumberTestArgs<[AudioContextOptions]>((x) => ({
              args: [{ sampleRate: x }],
              name: `Sample rate ${x}`,
            })),
          ],
          props: {
            currentTime: (x: number) => typeof x,
            sampleRate: null,
            state: null,
            baseLatency: (x: number) => round(x, 2).toString(),
            outputLatency: null,
            onstatechange: null,
          },
          errorConstructorArgLists: [
            ...createVariedTypeArgs<[AudioContextOptions]>(
              (args) => ({
                args,
                name: `AudioContextOptions arg ${args[0]}`,
              }),
              [{ sampleRate: 44100 }]
            ),
            ...createVariedTypeArgs<[AudioContextOptions]>(
              ([x]) => ({
                args: [{ sampleRate: x }],
                name: `Sample rate ${x}`,
              }),
              [{ sampleRate: 44100 }]
            ),
          ],
          methods: {
            createPeriodicWave: [
              {
                args: [
                  new Float32Array([1, 2, 3]),
                  new Float32Array([4, 5, 6]),
                ],
                name: "Two Float32Arrays length 3",
                stringifyResult: (wave) => wave.constructor.name,
              },
              {
                args: [
                  [1, 2],
                  [3, 4],
                ],
                name: "Two arrays length 2",
                stringifyResult: (wave) => wave.constructor.name,
              },
              {
                args: [
                  new Float32Array([1, 2, 3]),
                  new Float32Array([4, 5, 6]),
                  { disableNormalization: true },
                ],
                name: "Two Float32Arrays length 3 with disableNormalization",
                stringifyResult: (wave) => wave.constructor.name,
              },
            ],
          },
          errorMethods: {
            createPeriodicWave: [
              ...createVariedTypeArgs<
                [Float32Array, Float32Array, PeriodicWaveConstraints]
              >(
                (args) => ({
                  args,
                  name: `Float32Array args ${args[0]} ${args[1]} ${args[2]}`,
                }),
                [new Float32Array([1, 2, 3]), new Float32Array([4, 5, 6]), {}]
              ),
              ...createVariedTypeArgs<
                [Float32Array, Float32Array, PeriodicWaveConstraints]
              >(
                (args) => ({
                  args: [[args[0], 2], [3, 4], {}],
                  name: `Args with value in real ${args[0]}`,
                }),
                [new Float32Array([1, 2, 3]), new Float32Array([4, 5, 6]), {}]
              ),
              ...createVariedTypeArgs<
                [Float32Array, Float32Array, PeriodicWaveConstraints]
              >(
                (args) => ({
                  args: [[1, 2], [args[0], 4], {}],
                  name: `Args with value in imag ${args[0]}`,
                }),
                [new Float32Array([1, 2, 3]), new Float32Array([4, 5, 6]), {}]
              ),
              ...createVariedTypeArgs<
                [Float32Array, Float32Array, PeriodicWaveConstraints]
              >(
                (args) => ({
                  args: [[args[0], 2], [args[0], 4], {}],
                  name: `Args with value in real and imag ${args[0]}`,
                }),
                [new Float32Array([1, 2, 3]), new Float32Array([4, 5, 6]), {}]
              ),
              ...createVariedTypeArgs<
                [Float32Array, Float32Array, PeriodicWaveConstraints]
              >(
                (args) => ({
                  args: [[1, 2], [3, 4], { disableNormalization: args[2] }],
                  name: `Args with disableNormalization ${args[2]}`,
                }),
                [new Float32Array([1, 2, 3]), new Float32Array([4, 5, 6]), {}]
              ),
              ...createMissingArgs<[Float32Array, Float32Array]>(
                (args) => ({
                  args,
                  name: `Float32Array args ${args[0]} ${args[1]}`,
                }),
                [new Float32Array([1, 2, 3]), new Float32Array([4, 5, 6])]
              ),
            ],
          },
          cleanup: safeClose,
        })
      },
    },
    destination: {
      name: "Destination",
      run: async ({ mockWebAudio }) => {
        const ctx = new AudioContext()
        const mockCtx = new mockWebAudio.api.AudioContext()

        return compareInstance({
          real: ctx.destination,
          mock: mockCtx.destination,
          name: "Destination",
          props: {
            channelCount: null,
            channelCountMode: null,
            channelInterpretation: null,
            maxChannelCount: null,
            numberOfInputs: null,
            numberOfOutputs: null,
            context: (ctx) => ctx.constructor.name,
          },
        })
      },
    },
    time: {
      name: "Time (currentTime/getOutputTimestamp)",
      run: async ({ mockWebAudio }) => {
        const ctx = new AudioContext()
        const mockCtx = new mockWebAudio.api.AudioContext()
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

        // This test simply throws if there is an error, which
        // is caught higher up
        return { errors: [] }
      },
    },
    stateMethods: {
      name: "State methods (resume, suspend, close)",
      run: async ({ mockWebAudio }) => {
        const ctx = new AudioContext()
        const mockCtx = new mockWebAudio.api.AudioContext()
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

        safeClose(ctx)
        safeClose(mockCtx)

        // this test throws an error that is caught at a higher level
        return { errors: [] }
      },
    },
    audioNodes: {
      name: "Audio node methods",
      run: async ({ mockWebAudio }) => {
        const ctx = new AudioContext()
        const mockCtx = new mockWebAudio.api.AudioContext()
        const errors: Error[] = []
        Object.entries(createAudioNodesTestConfig()).forEach(([name, node]) => {
          const meta = AUDIO_NODES[name as keyof typeof AUDIO_NODES]

          if (meta.contextMethod) {
            const ctxNode = (ctx as any)[meta.contextMethod](
              ...(node.contextMethodArgs as any[])
            )
            const mockCtxNode: AudioNode = (mockCtx as any)[meta.contextMethod](
              ...(node.contextMethodArgs as any[])
            )

            appLogger.debug(`AudioContext ${meta.contextMethod}`, {
              ctxNode,
              mockCtxNode,
            })

            const isAudioParam = (x: unknown): x is AudioParam =>
              x?.constructor?.name === "AudioParam"

            const comparisonProps = (
              node.comparisonProperties as string[]
            ).reduce<{
              [key: string]: (x: unknown) => string
            }>((acc, prop) => {
              acc[prop] = (x) =>
                isAudioParam(x)
                  ? `value ${x.value}, defaultValue ${x.defaultValue}, minValue ${x.minValue}, maxValue ${x.maxValue}, automationRate ${x.automationRate}`
                  : x?.toString() ?? ""
              return acc
            }, {})

            compareInstance<AudioNode>({
              real: ctxNode,
              mock: mockCtxNode,
              name: "Audio Node Method for " + meta.constructorName,
              props: {
                channelCount: null,
                channelCountMode: null,
                channelInterpretation: null,
                numberOfInputs: null,
                numberOfOutputs: null,
                ...(comparisonProps as any),
              },
              errors,
              cleanup: (node) => node.disconnect(),
            })
          }
        })

        safeClose(ctx)
        safeClose(mockCtx)

        return { errors }
      },
    },
  },
}
