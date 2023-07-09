// https://stackoverflow.com/questions/49580725/is-it-possible-to-restrict-typescript-object-to-contain-only-properties-defined

import { KeyOfType } from "./keys"

export type Impossible<K extends keyof any> = {
  [P in K]: never
}

export type NoExtraProperties<T, U extends T = T> = U &
  Impossible<Exclude<keyof U, keyof T>>

export type PickAny<T, K extends string | number | symbol> = Pick<
  T,
  KeyOfType<T, K>
>

/** Does not change `T` but validates that its shape matches the AbstractMap type */
export type ValidatedTypeMapping<
  T extends AbstractMap,
  AbstractMap extends { [key: string | number | symbol]: unknown }
> = T
