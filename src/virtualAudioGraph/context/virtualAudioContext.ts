import mergeWith from "lodash/mergeWith"
import { nanoid } from "nanoid"
import { DeeplyPartial } from "@/lib/util/types"
import {
  AudioContextClassOptions,
  CreateAudioContextKind,
  CreateAudioContextName,
} from "@/nativeWebAudio"

export type DefinedAudioContextClassOptions<
  Kind extends CreateAudioContextKind = CreateAudioContextKind
> = Exclude<AudioContextClassOptions<CreateAudioContextName<Kind>>, undefined>

export interface VirtualAudioContext<
  Kind extends CreateAudioContextKind = CreateAudioContextKind
> {
  id: string
  kind: Kind
  options: DefinedAudioContextClassOptions<CreateAudioContextName<Kind>>
}

export type CreateVirtualAudioContextOptions<
  Kind extends CreateAudioContextKind = CreateAudioContextKind
> = {
  id?: string
  kind: Kind
} & (undefined extends AudioContextClassOptions<CreateAudioContextName<Kind>>
  ? { options?: AudioContextClassOptions<CreateAudioContextName<Kind>> }
  : { options: AudioContextClassOptions<CreateAudioContextName<Kind>> })

const createVirtualAudioContext = <Kind extends CreateAudioContextKind>({
  id,
  kind,
  options,
}: CreateVirtualAudioContextOptions<Kind>): VirtualAudioContext<Kind> => ({
  id: id || nanoid(),
  kind,
  options: options || ({} as any),
})

export type VirtualAudioContextOptionsUpdate<
  Kind extends CreateAudioContextKind = CreateAudioContextKind
> = DeeplyPartial<DefinedAudioContextClassOptions<CreateAudioContextName<Kind>>>

/** @todo make respective virtual audio node util similar, possibly move to native web audio module */
const updateAudioContextOptions = <
  Kind extends CreateAudioContextKind = CreateAudioContextKind
>(
  prevOptions: DefinedAudioContextClassOptions<CreateAudioContextName<Kind>>,
  updatedOptions: VirtualAudioContextOptionsUpdate
): DefinedAudioContextClassOptions<CreateAudioContextName<Kind>> =>
  mergeWith({}, prevOptions, updatedOptions, (_obj, srcValue) => {
    if (Array.isArray(srcValue)) return srcValue
  })

const updateVirtualAudioContextKind = <
  NewKind extends CreateAudioContextKind = CreateAudioContextKind
>(
  context: VirtualAudioContext,
  kind: NewKind,
  options?: AudioContextClassOptions<CreateAudioContextName<NewKind>>
): VirtualAudioContext<NewKind> => {
  if (kind === context.kind) {
    return {
      ...context,
      options: options || context.options,
    } as VirtualAudioContext<NewKind>
  }
  return {
    id: context.id,
    kind,
    options: options || ({} as any),
  }
}

export const virtualAudioContextUtil = {
  create: createVirtualAudioContext,
  updateName: updateVirtualAudioContextKind,
  updateOptions: updateAudioContextOptions,
}
