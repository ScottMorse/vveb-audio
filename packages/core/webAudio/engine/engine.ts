import { mix } from "ts-mixer"
import { _AudioContextUtility } from "./engineUtility/audioContext"
import { _AudioNodeUtility } from "./engineUtility/audioNode"
import { _PeriodicWaveUtility } from "./engineUtility/periodicWave"
import {
  EngineOptions,
  createEngineInternals,
  EngineInternals,
  EngineUtility,
} from "./engineUtility"
import { _AudioBufferUtility } from "./engineUtility/audioBuffer"
import { _AudioWorkletUtility } from "./engineUtility/audioWorklet"
import { WebAudioImplName } from "../api"

type MixinWorkaround<T> = Omit<T, "internals"> // needed to merge the EngineUtility types
export interface Engine<W extends WebAudioImplName>
  extends _AudioContextUtility<W>,
    MixinWorkaround<_AudioNodeUtility<W>>,
    MixinWorkaround<_PeriodicWaveUtility<W>>,
    MixinWorkaround<_AudioBufferUtility<W>>,
    MixinWorkaround<_AudioWorkletUtility<W>> {}

@mix(
  _AudioContextUtility,
  _AudioNodeUtility,
  _PeriodicWaveUtility,
  _AudioBufferUtility,
  _AudioWorkletUtility
)
class _Engine extends EngineUtility {}

type EngineConstructor = new <
  W extends WebAudioImplName
>(
  internals: EngineInternals<W>
) => Engine<W>

export const createEngine = <W extends WebAudioImplName = "native">(
  options?: EngineOptions<W>
) => new (_Engine as EngineConstructor)(createEngineInternals(options))
