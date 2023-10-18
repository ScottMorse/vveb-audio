import { compareInstance, compareThrow } from "src/lib/testUtils"
import { TestGroupConfig } from "../testGroupConfig"

/**
 * @todo These tests are currently less complete since MediaStream
 * is not a high priority to mock over the core Web Audio API.
 */
export const MEDIA_STREAM_TRACK_TEST_GROUP: TestGroupConfig = {
  name: "MediaStreamTrack",
  tests: {
    compareClass: {
      name: "Compare Class",
      run: ({ mockWebAudio }) => {
        const { errors } = compareThrow({
          real: () => new MediaStreamTrack(),
          mock: () => new mockWebAudio.api.MediaStreamTrack(),
          name: "Illegal Constructor",
        })

        return compareInstance({
          name: "Mock MediaStreamTrack",
          real: new AudioContext()
            .createMediaStreamDestination()
            .stream.getTracks()[0],
          mock: new mockWebAudio.api.AudioContext()
            .createMediaStreamDestination()
            .stream.getTracks()[0],
          props: {
            id: (x: string) => typeof x,
            enabled: null,
            kind: null,
            label: null,
            onended: null,
            onmute: null,
            onunmute: null,
            readyState: null,
            contentHint: null,
          },
          errors,
        })
      },
    },
  },
}
