import { ValidatedTypeMapping } from "@@core/internal/util/types"
import * as StandardizedAudioContext from "standardized-audio-context"
import {
  AbstractWebAudioImpl,
  SupportedWebAudioMemberName,
} from "./apiInterface"

export const createStandardizedWebAudioApi = () => {
  const standardized = {
    name: "standardized" as const,
    api: {} as {
      [key in SupportedWebAudioMemberName]: typeof StandardizedAudioContext[key]
    },
  }

  for (const _key in StandardizedAudioContext) {
    const key = _key as SupportedWebAudioMemberName
    if (typeof globalThis[key]) {
      standardized.api[key] = StandardizedAudioContext[key] as any
    }
  }
  return standardized as ValidatedTypeMapping<
    typeof standardized,
    AbstractWebAudioImpl
  >
}
