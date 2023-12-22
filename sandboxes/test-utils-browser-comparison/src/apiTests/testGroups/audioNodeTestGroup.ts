import { delay } from "@@core/internal/testing/delay"
import { AppState } from "src/lib/appContext"
import {
  compareInstance,
  compareThrow,
  createCommonNumberTestArgs,
  createVariedTypeArgs,
} from "src/lib/testUtils"
import { compareErrors } from "src/lib/util"
import { node } from "webpack"
import { TestGroupConfig } from "../testGroupConfig"

const safeClose = (ctx: AudioContext) => {
  try {
    ctx.close()
  } catch (error) {
    // ignore
  }
}

export const AUDIO_NODE_TEST_GROUP: TestGroupConfig = {
  name: "AudioNode",
  tests: {
    connect: {
      name: "Connect API",
      run: ({ mockWebAudio }) => {
        const audioContext = new AudioContext()
        const mockAudioContext = new mockWebAudio.api.AudioContext()

        const otherCtx = new AudioContext()
        const otherMockCtx = new mockWebAudio.api.AudioContext()

        const errors: Error[] = []

        const testNode = audioContext.createChannelSplitter() as {
          connect(...args: any[]): void
        }
        const mockTestNode = mockAudioContext.createChannelSplitter() as {
          connect(...args: any[]): void
        }

        compareThrow({
          real: () => testNode.connect(otherCtx.destination),
          mock: () => mockTestNode.connect(otherMockCtx.destination),
          name: "connect to another context's destination",
          errors,
        })

        compareThrow({
          real: () => testNode.connect(audioContext.destination),
          mock: () => mockTestNode.connect(mockAudioContext.destination),
          name: "connect to itself",
          errors,
        })

        compareThrow({
          real: () => testNode.connect(audioContext.createGain(), 2),
          mock: () => mockTestNode.connect(mockAudioContext.createGain(), 2),
          name: "output mismatch",
          errors,
        })

        compareThrow({
          real: () => testNode.connect(audioContext.createGain(), 0, 2),
          mock: () => mockTestNode.connect(mockAudioContext.createGain(), 0, 2),
          name: "input mismatch",
          errors,
        })

        compareThrow({
          real: () => testNode.connect(audioContext.createGain(), 2, 2),
          mock: () => mockTestNode.connect(mockAudioContext.createGain(), 2, 2),
          name: "input and output mismatch",
          errors,
        })

        createCommonNumberTestArgs((x) =>
          compareThrow({
            real: () => testNode.connect(audioContext.createGain(), x),
            mock: () => mockTestNode.connect(mockAudioContext.createGain(), x),
            name: `output ${x}`,
            errors,
          })
        )

        createVariedTypeArgs(
          (x) =>
            compareThrow({
              real: () => testNode.connect(x),
              mock: () => mockTestNode.connect(x),
              name: `destination ${x}`,
              errors,
            }),
          [{}]
        )

        createVariedTypeArgs(
          ([x]) =>
            compareThrow({
              real: () => testNode.connect(audioContext.createGain(), x, 0),
              mock: () =>
                mockTestNode.connect(mockAudioContext.createGain(), x, 0),
              name: `output ${x}`,
              errors,
            }),
          [{}]
        )

        createVariedTypeArgs(
          ([x]) =>
            compareThrow({
              real: () => testNode.connect(audioContext.createGain(), 0, x),
              mock: () =>
                mockTestNode.connect(mockAudioContext.createGain(), 0, x),
              name: `input ${x}`,
              errors,
            }),
          [{}]
        )

        safeClose(audioContext)
        safeClose(otherCtx)

        return { errors }
      },
    },
    disconnect: {
      name: "Disconnect API",
      run: ({ mockWebAudio }) => {
        const audioContext = new AudioContext()
        const mockAudioContext = new mockWebAudio.api.AudioContext()

        const otherCtx = new AudioContext()
        const otherMockCtx = new mockWebAudio.api.AudioContext()

        const errors: Error[] = []

        const testNode = audioContext.createChannelSplitter() as AudioNode & {
          disconnect(...args: any[]): void
        }
        const mockTestNode =
          mockAudioContext.createChannelSplitter() as AudioNode & {
            disconnect(...args: any[]): void
          }

        /**
         * Connects test nodes,
         * calls a provided callback with the nodes that have been connected,
         * cleans up connections afterwards.
         */
        const withConnection = (
          callback: (
            connectedNode: AudioNode,
            mockConnectedNode: AudioNode
          ) => unknown,
          output?: number,
          input?: number
        ) => {
          const connectee = audioContext.createChannelMerger()
          const mockConnectee = mockAudioContext.createChannelMerger()

          testNode.connect(connectee, output, input)
          mockTestNode.connect(mockConnectee, output, input)

          callback(connectee, mockConnectee)

          testNode.disconnect()
          mockTestNode.disconnect()
        }

        compareThrow({
          real: () => testNode.disconnect(),
          mock: () => mockTestNode.disconnect(),
          name: "argless disconnect",
          errors,
        })

        withConnection(() =>
          compareThrow({
            real: () => testNode.disconnect(),
            mock: () => mockTestNode.disconnect(),
            name: "argless disconnect (connected)",
            errors,
          })
        )

        withConnection(() =>
          compareThrow({
            real: () => testNode.disconnect(1),
            mock: () => mockTestNode.disconnect(1),
            name: "disconnect incorrect output",
            errors,
          })
        )

        withConnection(
          () =>
            compareThrow({
              real: () => testNode.disconnect(3),
              mock: () => mockTestNode.disconnect(3),
              name: "disconnect incorrect output",
              errors,
            }),
          2,
          3
        )
        return { errors }

        withConnection((connectee, mockConnectee) =>
          compareThrow({
            real: () => testNode.disconnect(connectee, 1),
            mock: () => mockTestNode.disconnect(mockConnectee, 1),
            name: "disconnect incorrect output (second arg)",
            errors,
          })
        )

        withConnection(
          () =>
            compareThrow({
              real: () => testNode.disconnect(3),
              mock: () => mockTestNode.disconnect(3),
              name: "disconnect incorrect output (second arg)",
              errors,
            }),
          2,
          3
        )

        withConnection(
          (connectee, mockConnectee) =>
            compareThrow({
              real: () => testNode.disconnect(connectee, 1, 2),
              mock: () => mockTestNode.disconnect(mockConnectee, 1, 2),
              name: "disconnect incorrect input",
              errors,
            }),
          1,
          4
        )

        compareThrow({
          real: () => testNode.disconnect(6),
          mock: () => mockTestNode.disconnect(6),
          name: "disconnect out of range output",
          errors,
        })

        withConnection(() =>
          compareThrow({
            real: () => testNode.disconnect(6),
            mock: () => mockTestNode.disconnect(6),
            name: "disconnect out of range output (connected)",
            errors,
          })
        )

        compareThrow({
          real: () => testNode.disconnect(otherCtx.destination),
          mock: () => mockTestNode.disconnect(otherMockCtx.destination),
          name: "disconnect from another context's destination",
          errors,
        })

        withConnection(() =>
          compareThrow({
            real: () => testNode.disconnect(otherCtx.destination),
            mock: () => mockTestNode.disconnect(otherMockCtx.destination),
            name: "disconnect from another context's destination (connected)",
            errors,
          })
        )

        compareThrow({
          real: () => testNode.disconnect(testNode),
          mock: () => mockTestNode.disconnect(mockTestNode),
          name: "disconnect from itself",
          errors,
        })

        withConnection(() =>
          compareThrow({
            real: () => testNode.disconnect(testNode),
            mock: () => mockTestNode.disconnect(mockTestNode),
            name: "disconnect from itself",
            errors,
          })
        )

        createCommonNumberTestArgs((x) =>
          compareThrow({
            real: () => testNode.disconnect(x),
            mock: () => mockTestNode.disconnect(x),
            name: `(gen) output ${x}`,
            errors,
          })
        )

        withConnection(() =>
          createCommonNumberTestArgs((x) =>
            compareThrow({
              real: () => testNode.disconnect(x),
              mock: () => mockTestNode.disconnect(x),
              name: `(gen) output ${x} (connected)`,
              errors,
            })
          )
        )

        createVariedTypeArgs(
          (x) =>
            compareThrow({
              real: () => testNode.disconnect(x),
              mock: () => mockTestNode.disconnect(x),
              name: `(gen) destination ${x}`,
              errors,
            }),
          [{}]
        )

        withConnection(() =>
          createVariedTypeArgs(
            (x) =>
              compareThrow({
                real: () => testNode.disconnect(x),
                mock: () => mockTestNode.disconnect(x),
                name: `(gen) destination ${x} (connected)`,
                errors,
              }),
            [{}]
          )
        )

        createVariedTypeArgs(
          ([x]) =>
            compareThrow({
              real: () => testNode.disconnect(x, 0, 0),
              mock: () => mockTestNode.disconnect(x, 0, 0),
              name: `(gen) destination ${x} with other args`,
              errors,
            }),
          [{}]
        )

        withConnection(() =>
          createVariedTypeArgs(
            ([x]) =>
              compareThrow({
                real: () => testNode.disconnect(x, 0, 0),
                mock: () => mockTestNode.disconnect(x, 0, 0),
                name: `(gen) destination ${x} with other args (connected)`,
                errors,
              }),
            [{}]
          )
        )

        createVariedTypeArgs(
          ([x]) =>
            compareThrow({
              real: () => testNode.disconnect(audioContext.destination, x),
              mock: () =>
                mockTestNode.disconnect(mockAudioContext.destination, x),
              name: `(gen) output ${x}`,
              errors,
            }),
          [{}]
        )

        withConnection((connectee, mockConnectee) =>
          createVariedTypeArgs(
            ([x]) =>
              compareThrow({
                real: () => testNode.disconnect(connectee, x),
                mock: () => mockTestNode.disconnect(mockConnectee, x),
                name: `(gen) output ${x} (connected)`,
                errors,
              }),
            [{}]
          )
        )

        createVariedTypeArgs(
          ([x]) =>
            compareThrow({
              real: () => testNode.disconnect(audioContext.destination, 0, x),
              mock: () =>
                mockTestNode.disconnect(mockAudioContext.destination, 0, x),
              name: `(gen) input ${x}`,
              errors,
            }),
          [{}]
        )

        withConnection((connectee, mockConnectee) =>
          createVariedTypeArgs(
            ([x]) =>
              compareThrow({
                real: () => testNode.disconnect(connectee, 0, x),
                mock: () => mockTestNode.disconnect(mockConnectee, 0, x),
                name: `(gen) input ${x} (connected)`,
                errors,
              }),
            [{}]
          )
        )

        safeClose(audioContext)
        safeClose(otherCtx)

        return { errors }
      },
    },
  },
}
