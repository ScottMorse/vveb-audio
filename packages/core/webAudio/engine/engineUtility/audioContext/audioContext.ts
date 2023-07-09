import { WebAudioImplName } from "@@core/webAudio/api"
import {
  EngineInternals,
  EngineUtility,
} from "@@core/webAudio/engine/engineUtility"
import {
  AudioContextInstance,
  AudioContextName,
  AUDIO_CONTEXTS,
} from "@@core/webAudio/types"
import { waitForCanStartAudioContext } from "./canStart"
import { AudioContextUtilityEventTarget, MainContextEvent } from "./events"

export type CreateContextParam<N extends AudioContextName> = {
  kind?: N
} & (N extends "live"
  ? {
      options?: AudioContextOptions
    }
  : {
      options: OfflineAudioContextOptions
    })

export class _AudioContextUtility<
  W extends WebAudioImplName = WebAudioImplName
> extends EngineUtility {
  constructor(engine: EngineInternals<W>) {
    super(engine as any)
    waitForCanStartAudioContext(() => {
      this._eventTarget.dispatchEvent(new Event("canStart"))
      this._canStart = true
    })
  }

  get canStart() {
    return this._canStart
  }

  createContext<N extends AudioContextName = "live">(
    param: CreateContextParam<N> = {
      kind: "live",
    } as CreateContextParam<N>
  ): AudioContextInstance<N, W> {
    const { kind = "live", options } = param
    const Context = this.api[AUDIO_CONTEXTS[kind].constructor] as any
    return new Context(options)
  }

  onCanStart(callback: () => unknown) {
    this._eventTarget.addEventListener("canStart", callback as any)
  }

  offCanStart(callback: () => unknown) {
    this._eventTarget.removeEventListener("canStart", callback as any)
  }

  protected _eventTarget = new AudioContextUtilityEventTarget<W>()
  protected _canStart = false
}

export type AudioContextUtility<W extends WebAudioImplName> =
  _AudioContextUtility<W>

export const createAudioContextUtility = <
  W extends WebAudioImplName = WebAudioImplName
>(
  engineInternals: EngineInternals<W>
): AudioContextUtility<W> => new _AudioContextUtility(engineInternals)
