import { WebAudioImplName } from "@@core/webAudio/api"
import {
  EngineUtility,
  EngineInternals,
} from "@@core/webAudio/engine/engineUtility"

export class _AudioBufferUtility<
  W extends WebAudioImplName = WebAudioImplName
> extends EngineUtility<W> {
  createAudioBuffer(options: AudioBufferOptions) {
    return new this.api.AudioBuffer(options as any)
  }
}

export type AudioBufferUtility<W extends WebAudioImplName = WebAudioImplName> =
  _AudioBufferUtility<W>

export const createAudioBufferUtility = <
  W extends WebAudioImplName = WebAudioImplName
>(
  internals: EngineInternals<W>
): AudioBufferUtility<W> => new _AudioBufferUtility(internals)
