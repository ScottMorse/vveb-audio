import { strict as assert } from "assert"
import { Mock } from "../../lib/engine"
import { compareErrors } from "../../lib/util"
import { RuntimeTest } from "../runtimeTest"

export const AUDIO_BUFFER_TESTS: RuntimeTest[] = [
  {
    name: "Constructor",
    test: async () => {
      const buffer = new AudioBuffer({
        length: 1000,
        sampleRate: 44100,
        numberOfChannels: 2,
      })

      const mockBuffer = new Mock.AudioBuffer({
        length: 1000,
        sampleRate: 44100,
        numberOfChannels: 2,
      })

      assert.equal(buffer.length, mockBuffer.length)
      assert.equal(buffer.sampleRate, mockBuffer.sampleRate)
      assert.equal(buffer.duration, mockBuffer.duration)
      assert.equal(buffer.numberOfChannels, mockBuffer.numberOfChannels)
    },
  },
  {
    name: "Constructor errors",
    test: async () => {
      // sampleRate is required and must be a finite number greater than 0

      compareErrors(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        () => new AudioBuffer(),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        () => new Mock.AudioBuffer(),
        "no arg"
      )

      compareErrors(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        () => new AudioBuffer(123),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        () => new Mock.AudioBuffer(123),
        "number arg"
      )

      compareErrors(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        () => new AudioBuffer(null),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        () => new Mock.AudioBuffer(null),
        "null arg"
      )

      compareErrors(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        () => new AudioBuffer({ length: 1000, numberOfChannels: 2 }),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        () => new Mock.AudioBuffer({ length: 1000, numberOfChannels: 2 }),
        "missing sampleRate"
      )

      compareErrors(
        () =>
          new AudioBuffer({ length: 1000, numberOfChannels: 2, sampleRate: 0 }),
        () =>
          new Mock.AudioBuffer({
            length: 1000,
            numberOfChannels: 2,
            sampleRate: 0,
          }),
        "sampleRate is 0"
      )

      compareErrors(
        () =>
          new AudioBuffer({
            length: 1000,
            numberOfChannels: 2,
            sampleRate: 10,
          }),
        () =>
          new Mock.AudioBuffer({
            length: 1000,
            numberOfChannels: 2,
            sampleRate: 10,
          }),
        "sampleRate is 10"
      )

      compareErrors(
        () =>
          new AudioBuffer({
            length: 1000,
            numberOfChannels: 2,
            sampleRate: -1,
          }),
        () =>
          new Mock.AudioBuffer({
            length: 1000,
            numberOfChannels: 2,
            sampleRate: -1,
          }),
        "sampleRate is -1"
      )

      compareErrors(
        () =>
          new AudioBuffer({
            length: 1000,
            numberOfChannels: 2,
            sampleRate: Infinity,
          }),
        () =>
          new Mock.AudioBuffer({
            length: 1000,
            numberOfChannels: 2,
            sampleRate: Infinity,
          }),
        "sampleRate is Infinity"
      )

      compareErrors(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        () => new AudioBuffer({ sampleRate: 44100, numberOfChannels: 2 }),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        () => new Mock.AudioBuffer({ sampleRate: 44100, numberOfChannels: 2 }),
        "missing length"
      )

      compareErrors(
        () =>
          new AudioBuffer({
            length: 0,
            numberOfChannels: 2,
            sampleRate: 44100,
          }),
        () =>
          new Mock.AudioBuffer({
            length: 0,
            numberOfChannels: 2,
            sampleRate: 44100,
          }),
        "length is 0"
      )

      compareErrors(
        () =>
          new AudioBuffer({
            length: -1,
            numberOfChannels: 2,
            sampleRate: 44100,
          }),
        () =>
          new Mock.AudioBuffer({
            length: -1,
            numberOfChannels: 2,
            sampleRate: 44100,
          }),
        "length is -1"
      )

      compareErrors(
        () =>
          new AudioBuffer({
            length: Infinity,
            numberOfChannels: 2,
            sampleRate: 44100,
          }),
        () =>
          new Mock.AudioBuffer({
            length: Infinity,
            numberOfChannels: 2,
            sampleRate: 44100,
          }),
        "length is Infinity"
      )

      // numberOfChannels is optional, but must be a finite number greater than 0 if provided

      compareErrors(
        () =>
          new AudioBuffer({
            length: 1000,
            numberOfChannels: 0,
            sampleRate: 44100,
          }),
        () =>
          new Mock.AudioBuffer({
            length: 1000,
            numberOfChannels: 0,
            sampleRate: 44100,
          }),
        "numberOfChannels is 0"
      )

      compareErrors(
        () =>
          new AudioBuffer({
            length: 1000,
            numberOfChannels: -1,
            sampleRate: 44100,
          }),
        () =>
          new Mock.AudioBuffer({
            length: 1000,
            numberOfChannels: -1,
            sampleRate: 44100,
          }),
        "numberOfChannels is -1"
      )

      compareErrors(
        () =>
          new AudioBuffer({
            length: 1000,
            numberOfChannels: Infinity,
            sampleRate: 44100,
          }),
        () =>
          new Mock.AudioBuffer({
            length: 1000,
            numberOfChannels: Infinity,
            sampleRate: 44100,
          }),
        "numberOfChannels is Infinity"
      )
    },
  },
  {
    name: "getChannelData",
    test: async () => {
      const buffer = new AudioBuffer({
        length: 1000,
        sampleRate: 44100,
        numberOfChannels: 2,
      })
      const mockBuffer = new Mock.AudioBuffer({
        length: 1000,
        sampleRate: 44100,
        numberOfChannels: 2,
      })

      assert.deepEqual(buffer.getChannelData(0), mockBuffer.getChannelData(0))
      assert.deepEqual(buffer.getChannelData(1), mockBuffer.getChannelData(1))

      // Test for errors with invalid channel indexes
      assert.throws(() => buffer.getChannelData(-1))
      assert.throws(() => buffer.getChannelData(2))
    },
  },
  {
    name: "copyToChannel/copyFromChannel",
    test: async () => {
      const buffer = new AudioBuffer({
        length: 1000,
        sampleRate: 44100,
        numberOfChannels: 2,
      })
      const mockBuffer = new Mock.AudioBuffer({
        length: 1000,
        sampleRate: 44100,
        numberOfChannels: 2,
      })

      const source = new Float32Array(1000)
      for (let i = 0; i < source.length; i++) {
        source[i] = Math.random() - 0.5
      }

      buffer.copyToChannel(source, 0)
      mockBuffer.copyToChannel(source, 0)

      const bufferOutput = new Float32Array(1000)
      const mockBufferOutput = new Float32Array(1000)

      buffer.copyFromChannel(bufferOutput, 0)
      mockBuffer.copyFromChannel(mockBufferOutput, 0)

      assert.deepEqual(bufferOutput, mockBufferOutput)
    },
  },
  {
    name: "copyFromChannel errors",
    test: async () => {
      const buffer = new AudioBuffer({
        length: 1000,
        sampleRate: 44100,
        numberOfChannels: 2,
      })
      const mockBuffer = new Mock.AudioBuffer({
        length: 1000,
        sampleRate: 44100,
        numberOfChannels: 2,
      })

      /* eslint-disable @typescript-eslint/ban-ts-comment */

      compareErrors(
        // @ts-ignore
        () => buffer.copyFromChannel(),
        // @ts-ignore
        () => mockBuffer.copyFromChannel(),
        "no args"
      )

      compareErrors(
        // @ts-ignore
        () => buffer.copyFromChannel(new Float32Array(1000)),
        // @ts-ignore
        () => mockBuffer.copyFromChannel(new Float32Array(1000)),
        "1 arg"
      )

      compareErrors(
        // @ts-ignore
        () => buffer.copyFromChannel(undefined, 0),
        // @ts-ignore
        () => mockBuffer.copyFromChannel(undefined, 0),
        "undefined arg 1"
      )

      compareErrors(
        // @ts-ignore
        () => buffer.copyFromChannel("foo", 0),
        // @ts-ignore
        () => mockBuffer.copyFromChannel("foo", 0),
        "string arg 1"
      )

      compareErrors(
        // @ts-ignore
        () => buffer.copyFromChannel(new Float32Array(1000), undefined),
        // @ts-ignore
        () => mockBuffer.copyFromChannel(new Float32Array(1000), undefined),
        "undefined arg 2"
      )

      compareErrors(
        // @ts-ignore
        () => buffer.copyFromChannel(new Float32Array(1000), "foo"),
        // @ts-ignore
        () => mockBuffer.copyFromChannel(new Float32Array(1000), "foo"),
        "string arg 2"
      )

      compareErrors(
        // @ts-ignore
        () => buffer.copyFromChannel(new Float32Array(1000), 0, null),
        // @ts-ignore
        () => mockBuffer.copyFromChannel(new Float32Array(1000), 0, null),
        "null arg 3"
      )

      compareErrors(
        // @ts-ignore
        () => buffer.copyFromChannel(new Float32Array(1000), 0, "foo"),
        // @ts-ignore
        () => mockBuffer.copyFromChannel(new Float32Array(1000), 0, "foo"),
        "string arg 3"
      )

      /* eslint-enable @typescript-eslint/ban-ts-comment */

      compareErrors(
        () => buffer.copyFromChannel(new Float32Array(1000), NaN),
        () => mockBuffer.copyFromChannel(new Float32Array(1000), NaN),
        "NaN arg 2"
      )

      compareErrors(
        () => buffer.copyFromChannel(new Float32Array(1000), Infinity),
        () => mockBuffer.copyFromChannel(new Float32Array(1000), Infinity),
        "Infinity arg 2"
      )

      compareErrors(
        () => buffer.copyFromChannel(new Float32Array(1000), -1),
        () => mockBuffer.copyFromChannel(new Float32Array(1000), -1),
        "-1 arg 2"
      )

      compareErrors(
        () => buffer.copyFromChannel(new Float32Array(1000), 0, NaN),
        () => mockBuffer.copyFromChannel(new Float32Array(1000), 0, NaN),
        "NaN arg 3"
      )

      compareErrors(
        () => buffer.copyFromChannel(new Float32Array(1000), 0, Infinity),
        () => mockBuffer.copyFromChannel(new Float32Array(1000), 0, Infinity),
        "Infinity arg 3"
      )

      compareErrors(
        () => buffer.copyFromChannel(new Float32Array(1000), 0, -1),
        () => mockBuffer.copyFromChannel(new Float32Array(1000), 0, -1),
        "-1 arg 3"
      )
    },
  },
  {
    name: "copyToChannel errors",
    test: async () => {
      const buffer = new AudioBuffer({
        length: 1000,
        sampleRate: 44100,
        numberOfChannels: 2,
      })
      const mockBuffer = new Mock.AudioBuffer({
        length: 1000,
        sampleRate: 44100,
        numberOfChannels: 2,
      })

      /* eslint-disable @typescript-eslint/ban-ts-comment */

      compareErrors(
        // @ts-ignore
        () => buffer.copyToChannel(),
        // @ts-ignore
        () => mockBuffer.copyToChannel(),
        "no args"
      )

      compareErrors(
        // @ts-ignore
        () => buffer.copyToChannel(new Float32Array(1000)),
        // @ts-ignore
        () => mockBuffer.copyToChannel(new Float32Array(1000)),
        "1 arg"
      )

      compareErrors(
        // @ts-ignore
        () => buffer.copyToChannel(undefined, 0),
        // @ts-ignore
        () => mockBuffer.copyToChannel(undefined, 0),
        "undefined arg 1"
      )

      compareErrors(
        // @ts-ignore
        () => buffer.copyToChannel("foo", 0),
        // @ts-ignore
        () => mockBuffer.copyToChannel("foo", 0),
        "string arg 1"
      )

      compareErrors(
        // @ts-ignore
        () => buffer.copyToChannel(new Float32Array(1000), undefined),
        // @ts-ignore
        () => mockBuffer.copyToChannel(new Float32Array(1000), undefined),
        "undefined arg 2"
      )

      compareErrors(
        // @ts-ignore
        () => buffer.copyToChannel(new Float32Array(1000), "foo"),
        // @ts-ignore
        () => mockBuffer.copyToChannel(new Float32Array(1000), "foo"),
        "string arg 2"
      )

      compareErrors(
        // @ts-ignore
        () => buffer.copyToChannel(new Float32Array(1000), 0, null),
        // @ts-ignore
        () => mockBuffer.copyToChannel(new Float32Array(1000), 0, null),
        "null arg 3"
      )

      compareErrors(
        // @ts-ignore
        () => buffer.copyToChannel(new Float32Array(1000), 0, "foo"),
        // @ts-ignore
        () => mockBuffer.copyToChannel(new Float32Array(1000), 0, "foo"),
        "string arg 3"
      )

      /* eslint-enable @typescript-eslint/ban-ts-comment */

      compareErrors(
        () => buffer.copyToChannel(new Float32Array(1000), NaN),
        () => mockBuffer.copyToChannel(new Float32Array(1000), NaN),
        "NaN arg 2"
      )

      compareErrors(
        () => buffer.copyToChannel(new Float32Array(1000), Infinity),
        () => mockBuffer.copyToChannel(new Float32Array(1000), Infinity),
        "Infinity arg 2"
      )

      compareErrors(
        () => buffer.copyToChannel(new Float32Array(1000), -1),
        () => mockBuffer.copyToChannel(new Float32Array(1000), -1),
        "-1 arg 2"
      )

      compareErrors(
        () => buffer.copyToChannel(new Float32Array(1000), 0, NaN),
        () => mockBuffer.copyToChannel(new Float32Array(1000), 0, NaN),
        "NaN arg 3"
      )

      compareErrors(
        () => buffer.copyToChannel(new Float32Array(1000), 0, Infinity),
        () => mockBuffer.copyToChannel(new Float32Array(1000), 0, Infinity),
        "Infinity arg 3"
      )

      compareErrors(
        () => buffer.copyToChannel(new Float32Array(1000), 0, -1),
        () => mockBuffer.copyToChannel(new Float32Array(1000), 0, -1),
        "-1 arg 3"
      )
    },
  },
  {
    name: "getChannelData errors",
    test: async () => {
      const buffer = new AudioBuffer({
        length: 1000,
        sampleRate: 44100,
        numberOfChannels: 2,
      })
      const mockBuffer = new Mock.AudioBuffer({
        length: 1000,
        sampleRate: 44100,
        numberOfChannels: 2,
      })

      /* eslint-disable @typescript-eslint/ban-ts-comment */

      compareErrors(
        // @ts-ignore
        () => buffer.getChannelData(),
        // @ts-ignore
        () => mockBuffer.getChannelData(),
        "no args"
      )

      compareErrors(
        // @ts-ignore
        () => buffer.getChannelData(undefined),
        // @ts-ignore
        () => mockBuffer.getChannelData(undefined),
        "undefined arg 1"
      )

      compareErrors(
        // @ts-ignore
        () => buffer.getChannelData("foo"),
        // @ts-ignore
        () => mockBuffer.getChannelData("foo"),
        "string arg 1"
      )

      /* eslint-enable @typescript-eslint/ban-ts-comment */

      compareErrors(
        () => buffer.getChannelData(NaN),
        () => mockBuffer.getChannelData(NaN),
        "NaN arg 1"
      )

      compareErrors(
        () => buffer.getChannelData(Infinity),
        () => mockBuffer.getChannelData(Infinity),
        "Infinity arg 1"
      )

      compareErrors(
        () => buffer.getChannelData(-1),
        () => mockBuffer.getChannelData(-1),
        "-1 arg 1"
      )

      compareErrors(
        () => buffer.getChannelData(2),
        () => mockBuffer.getChannelData(2),
        "channel index out of range"
      )
    },
  },
]
