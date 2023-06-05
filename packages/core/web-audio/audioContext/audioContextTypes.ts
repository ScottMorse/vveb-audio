import { ALL_AUDIO_CONTEXTS } from "./audioContexts"

type AllAudioContexts = typeof ALL_AUDIO_CONTEXTS

export type AudioContextName = keyof AllAudioContexts

export type AudioContextConfig<
  Name extends AudioContextName = AudioContextName
> = AllAudioContexts[Name]

export type AudioContextClass<
  Name extends AudioContextName = AudioContextName
> = AudioContextConfig<Name>["cls"]

export type AudioContextInstance<
  Name extends AudioContextName = AudioContextName
> = InstanceType<AudioContextClass<Name>>

export type AudioContextClassOptions<
  Name extends AudioContextName = AudioContextName
> = Name extends "offline"
  ? OfflineAudioContextOptions
  : ConstructorParameters<AudioContextClass<Name>>[0]
