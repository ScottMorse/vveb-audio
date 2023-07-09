import { WebAudioInstance, WebAudioImplName } from "@@core/webAudio/api"
import {
  EngineUtility,
  EngineInternals,
} from "@@core/webAudio/engine/engineUtility"
import {
  createAudioContextUtility,
} from "@@core/webAudio/engine/engineUtility/audioContext"

type AudioWorkletResult<W extends WebAudioImplName> = W extends "standardized"
  ? AudioWorkletNode | undefined
  : AudioWorkletNode

export class _AudioWorkletUtility<
  W extends WebAudioImplName = WebAudioImplName
> extends EngineUtility<W> {
  async addModule(
    context: WebAudioInstance<"AudioContext", W>,
    moduleURL: string,
    options?: WorkletOptions
  ) {
    await context.audioWorklet.addModule(moduleURL, options)
  }

  createAudioWorkletNode(
    context: WebAudioInstance<"AudioContext" | "OfflineAudioContext", W>,
    name: string,
    options?: AudioWorkletNodeOptions
  ): AudioWorkletResult<W> {
    return (
      this.api.AudioWorkletNode
        ? new this.api.AudioWorkletNode(context, name, options)
        : undefined
    ) as AudioWorkletResult<W>
  }

  protected _contextUtil = createAudioContextUtility(this.internals)
}

export type AudioWorkletUtility<W extends WebAudioImplName = WebAudioImplName> =
  _AudioWorkletUtility<W>

export const createAudioWorkletUtility = <
  W extends WebAudioImplName = WebAudioImplName
>(
  internals: EngineInternals<W>
): AudioWorkletUtility<W> => new _AudioWorkletUtility(internals)
