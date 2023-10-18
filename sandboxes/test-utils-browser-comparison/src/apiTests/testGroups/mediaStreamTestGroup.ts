import { compareClass } from "src/lib/testUtils"
import { TestGroupConfig } from "../testGroupConfig"

/**
 * @todo These tests are currently less complete since MediaStream
 * is not a high priority to mock over the core Web Audio API.
 */
export const MEDIA_STREAM_TEST_GROUP: TestGroupConfig = {
  name: "MediaStream",
  tests: {
    compareClass: {
      name: "Compare Class",
      run: ({ mockWebAudio }) => {
        return compareClass({
          name: "Mock MediaStream",
          real: MediaStream,
          mock: mockWebAudio.api.MediaStream,
          props: {
            active: null,
            id: (x: string) => typeof x,
            onaddtrack: null,
            onremovetrack: null,
          },
          constructorArgLists: [
            {
              name: "No args",
              args: [],
            },
            {
              name: "With MediaStream",
              args: [new MediaStream()],
            },
            {
              name: "With Tracks",
              args: [
                new AudioContext()
                  .createMediaStreamDestination()
                  .stream.getTracks(),
              ],
            },
          ],
        })
      },
    },
  },
}
