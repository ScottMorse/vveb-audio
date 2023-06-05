import { PickAny } from "@@core/internal/util/types"
import type * as SAC from "standardized-audio-context"

/**
 * An internal type that maps any interfaces available in
 * standardized-audio-context to an unknown implementation.
 *
 * standardized-audio-context contains a subset of the Web Audio API,
 * but the types it uses do not always cleanly swap out with native types,
 * so this type is used to help resolve available interfaces of an API
 * without dictating the implementation.
 */
export type AbstractWebAudio = {
  [key in keyof PickAny<typeof SAC, keyof typeof globalThis>]: unknown
}
