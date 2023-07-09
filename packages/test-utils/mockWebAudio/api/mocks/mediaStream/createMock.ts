import { MockMediaStream } from "./stream"
import { MockMediaStreamTrack } from "./track"

export const createMediaStreamMock = () => ({
  MediaStream: MockMediaStream,
  MediaStreamTrack: MockMediaStreamTrack,
})
