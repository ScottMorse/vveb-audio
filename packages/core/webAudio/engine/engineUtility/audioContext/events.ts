import { TypedEventTarget } from "@@core/internal/util/events"
import { WebAudioImplName } from "@@core/webAudio/api"
import { AudioContextInstance } from "@@core/webAudio/types"

export class MainContextEvent<
  W extends WebAudioImplName = WebAudioImplName
> extends Event {
  constructor(
    public context: AudioContextInstance<"live", W>,
    eventInitDict?: EventInit
  ) {
    super("mainContext", eventInitDict)
  }
}

export type AudioContextUtilityEvents<W extends WebAudioImplName> = {
  canStart: Event
}

export class AudioContextUtilityEventTarget<
  W extends WebAudioImplName
> extends TypedEventTarget<AudioContextUtilityEvents<W>> {}
