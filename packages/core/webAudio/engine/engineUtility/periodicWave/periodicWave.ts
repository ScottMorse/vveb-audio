import { WebAudioInstance, WebAudioImplName } from "@@core/webAudio/api"
import {
  EngineUtility,
  EngineInternals,
} from "@@core/webAudio/engine/engineUtility"
import { createAudioContextUtility } from "@@core/webAudio/engine/engineUtility/audioContext"

export class _PeriodicWaveUtility<
  W extends WebAudioImplName = WebAudioImplName
> extends EngineUtility<W> {
  createPeriodicWave(
    context: WebAudioInstance<"AudioContext" | "OfflineAudioContext", W>,
    options?: PeriodicWaveOptions
  ) {
    return new this.api.PeriodicWave(context, options)
  }

  protected _contextUtil = createAudioContextUtility(this.internals)
}

export type PeriodicWaveUtility<W extends WebAudioImplName = WebAudioImplName> =
  _PeriodicWaveUtility<W>

export const createPeriodicWaveUtility = <
  W extends WebAudioImplName = WebAudioImplName
>(
  internals: EngineInternals<W>
): PeriodicWaveUtility<W> => new _PeriodicWaveUtility(internals)
