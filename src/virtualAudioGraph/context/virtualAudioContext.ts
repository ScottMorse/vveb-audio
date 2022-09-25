import { nanoid } from "nanoid"
import { AudioContextClassOptions, AudioContextName } from "@/nativeWebAudio"

export interface VirtualAudioContext<
  Name extends AudioContextName = AudioContextName
> {
  id: string
  name: Name
  options: AudioContextClassOptions<Name>
}

export type CreateVirtualAudioContextOptions<
  Name extends AudioContextName = AudioContextName
> = {
  id?: string
  name: Name
} & (undefined extends AudioContextClassOptions<Name>
  ? { options?: AudioContextClassOptions<Name> }
  : { options: AudioContextClassOptions<Name> })

export const createVirtualAudioContext = <Name extends AudioContextName>({
  id,
  name,
  options,
}: CreateVirtualAudioContextOptions<Name>): VirtualAudioContext<Name> => ({
  id: id || nanoid(),
  name,
  options: options || {} as any,
})

export const updateVirtualAudioContextOptions = <Name extends AudioContextName>(context: VirtualAudiOContext<Name>, options: Exclude<AudioContextClassOptions<Name>, undefined>) => {
  const newOptions = 
}