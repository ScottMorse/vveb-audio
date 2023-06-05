import { ValidatedTypeMapping } from "@@core/internal/util/types"
import * as StandardizedAudioContext from "standardized-audio-context"
import { AbstractWebAudio } from "./apiInterface"

export const createStandardizedWebAudioApi = () => {
  const api = {} as {
    [key in keyof AbstractWebAudio]: typeof StandardizedAudioContext[key]
  }
  for (const _key in StandardizedAudioContext) {
    const key = _key as keyof AbstractWebAudio
    if (typeof globalThis[key]) {
      api[key] = StandardizedAudioContext[key] as any
    }
  }
  return api as ValidatedTypeMapping<typeof api, AbstractWebAudio>
}
