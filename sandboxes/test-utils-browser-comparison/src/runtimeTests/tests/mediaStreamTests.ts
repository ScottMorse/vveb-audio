import { strict as assert } from "assert"
import { createMockMediaStreamTrack } from "@@test-utils/mockWebAudio"
import { Mock } from "../../lib/mock"
import { compareErrors } from "../../lib/util"
import { RuntimeTest } from "../runtimeTest"

export const MEDIA_STREAM_TESTS: RuntimeTest[] = [
  {
    name: "Constructor",
    test: async ({ ctx }) => {
      const stream = new MediaStream()
      const mockStream = new Mock.MediaStream()

      assert.equal(stream.constructor.name, mockStream.constructor.name)
      assert.equal(stream.toString(), mockStream.toString())

      new MediaStream(new MediaStream())
      new Mock.MediaStream(new Mock.MediaStream())
      new MediaStream([])
      new Mock.MediaStream([])

      const realTrack = ctx.createMediaStreamDestination().stream.getTracks()[0]

      new MediaStream([realTrack])
      new Mock.MediaStream([createMockMediaStreamTrack({ kind: "audio" })])
    },
  },
  {
    name: "Constructor errors",
    test: async () => {
      /* eslint-disable @typescript-eslint/ban-ts-comment */

      compareErrors(
        () => new MediaStream({} as any),
        () => new Mock.MediaStream({} as any),
        "empty object arg"
      )

      compareErrors(
        () => new MediaStream("wrong" as any),
        () => new Mock.MediaStream("wrong" as any),
        "string arg"
      )

      compareErrors(
        () => new MediaStream(1 as any),
        () => new Mock.MediaStream(1 as any),
        "number arg"
      )

      compareErrors(
        () => new MediaStream(null as any),
        () => new Mock.MediaStream(null as any),
        "null arg"
      )

      compareErrors(
        () => new MediaStream([undefined] as any),
        () => new Mock.MediaStream([undefined] as any),
        "undefined track"
      )

      compareErrors(
        () => new MediaStream([null] as any),
        () => new Mock.MediaStream([null] as any),
        "null track"
      )

      compareErrors(
        () => new MediaStream([1] as any),
        () => new Mock.MediaStream([1] as any),
        "number track"
      )

      compareErrors(
        () => new MediaStream([{}] as any),
        () => new Mock.MediaStream([{}] as any),
        "empty object track"
      )

      compareErrors(
        () => new MediaStream([[]] as any),
        () => new Mock.MediaStream([[]] as any),
        "empty array track"
      )
    },
  },
]
