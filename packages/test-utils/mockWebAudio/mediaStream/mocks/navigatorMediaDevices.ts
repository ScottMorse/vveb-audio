import { MediaStream } from "./MediaStream"
import { createMockMediaStreamTrack } from "./MediaStreamTrack"

export const mockGetUserMedia = async (constraints: MediaStreamConstraints) => {
  const stream = new MediaStream()

  if (constraints.audio) {
    const audioTrack = createMockMediaStreamTrack({
      kind: "audio",
      constraints: constraints.audio === true ? undefined : constraints?.audio,
    })
    stream.addTrack(audioTrack)
  }

  if (constraints.video) {
    const videoTrack = createMockMediaStreamTrack({
      kind: "video",
      constraints: constraints.video === true ? undefined : constraints?.video,
    })
    stream.addTrack(videoTrack)
  }

  return stream
}
