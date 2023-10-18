import { WebAudioInstance, WebAudioImplName } from "@@core/webAudio/api"
import {
  EngineUtility,
  EngineInternals,
} from "@@core/webAudio/engine/engineUtility"
import {
  AudioNodeInstance,
  AudioNodeOptions,
  AUDIO_NODES,
  CreatableAudioNodeName,
} from "@@core/webAudio/types"
import { createAudioContextUtility } from "../audioContext"

export class _AudioNodeUtility<
  W extends WebAudioImplName
> extends EngineUtility<W> {
  createAudioNode<T extends CreatableAudioNodeName<W>>(
    type: T,
    context: WebAudioInstance<"AudioContext" | "OfflineAudioContext", W>,
    ...[options]: undefined extends AudioNodeOptions<T, W>
      ? [options?: AudioNodeOptions<T, W>]
      : [options: AudioNodeOptions<T, W>]
  ): AudioNodeInstance<T, W> {
    {
      return new (this.api as any)[AUDIO_NODES[type]["constructorName"]](
        context,
        options
      )
    }
  }

  protected _contextUtil = createAudioContextUtility(this.internals)
}

export type AudioNodeUtility<W extends WebAudioImplName> = _AudioNodeUtility<W>

export function createAudioNodeUtility<W extends WebAudioImplName>(
  internals: EngineInternals<W>
): AudioNodeUtility<W> {
  return new _AudioNodeUtility(internals)
}
