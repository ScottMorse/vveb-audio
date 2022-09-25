import mergeWith from "lodash/mergeWith"
import { nanoid } from "nanoid"
import { DeeplyPartial } from "@/lib/util/types"
import { AudioContextClassOptions, AudioContextName } from "@/nativeWebAudio"

export type DefinedAudioContextClassOptions<
  Name extends AudioContextName = AudioContextName
> = Exclude<AudioContextClassOptions<Name>, undefined>

export interface VirtualAudioContext<
  Name extends AudioContextName = AudioContextName
> {
  id: string
  name: Name
  options: DefinedAudioContextClassOptions<Name>
}

export type CreateVirtualAudioContextOptions<
  Name extends AudioContextName = AudioContextName
> = {
  id?: string
  name: Name
} & (undefined extends AudioContextClassOptions<Name>
  ? { options?: AudioContextClassOptions<Name> }
  : { options: AudioContextClassOptions<Name> })

const createVirtualAudioContext = <Name extends AudioContextName>({
  id,
  name,
  options,
}: CreateVirtualAudioContextOptions<Name>): VirtualAudioContext<Name> => ({
  id: id || nanoid(),
  name,
  options: options || ({} as any),
})

export type VirtualAudioContextOptionsUpdate<
  Name extends AudioContextName = AudioContextName
> = DeeplyPartial<DefinedAudioContextClassOptions<Name>>

/** @todo make respective virtual audio node util similar, possibly move to native web audio module */
const updateAudioContextOptions = <
  Name extends AudioContextName = AudioContextName
>(
  prevOptions: DefinedAudioContextClassOptions<Name>,
  updatedOptions: VirtualAudioContextOptionsUpdate
): DefinedAudioContextClassOptions<Name> =>
  mergeWith({}, prevOptions, updatedOptions, (_obj, srcValue) => {
    if (Array.isArray(srcValue)) return srcValue
  })

const updateVirtualAudioContextName = <
  NewName extends AudioContextName = AudioContextName
>(
  context: VirtualAudioContext,
  name: NewName,
  options?: AudioContextClassOptions<NewName>
): VirtualAudioContext<NewName> => {
  if (name === context.name) {
    return {
      ...context,
      options: options || context.options,
    } as VirtualAudioContext<NewName>
  }
  return {
    id: context.id,
    name: name,
    options: options || ({} as any),
  }
}

export const virtualAudioContextUtil = {
  create: createVirtualAudioContext,
  updateName: updateVirtualAudioContextName,
  updateOptions: updateAudioContextOptions,
}
