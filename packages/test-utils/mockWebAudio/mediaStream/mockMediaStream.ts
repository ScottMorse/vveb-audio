import {
  removeGlobalProperty,
  setGlobalProperty,
} from "../../internal/util/globals"
import { MediaStream, MediaStreamTrack } from "./mocks"

export const mockGlobalMediaStream = () => {
  setGlobalProperty("MediaStream", MediaStream)
  setGlobalProperty("MediaStreamTrack", MediaStreamTrack)
}

export const unMockGlobalMediaStream = () => {
  removeGlobalProperty("MediaStream")
  removeGlobalProperty("MediaStreamTrack")
}
