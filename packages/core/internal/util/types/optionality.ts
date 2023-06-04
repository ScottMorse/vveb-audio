/** Given keys are required, rest are unchanged (inverse of PartiallyOptional) */
export type PartiallyRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>

/** Given keys are optional, rest are unchanged (inverse of PartiallyRequired) */
export type PartiallyPartial<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>

/** Given keys are required, rest are optional (inverse of OnlyOptional) */
export type OnlyRequire<T, K extends keyof T> = Required<Pick<T, K>> &
  Partial<Omit<T, K>>

/** Given keys are optional, rest are required (inverse of OnlyRequire) */
export type OnlyOptional<T, K extends keyof T> = Partial<Pick<T, K>> &
  Required<Omit<T, K>>

/** All fields are required deeply */
export type DeeplyRequired<T> = T extends {
  [key: string | number | symbol]: any
}
  ? {
      [K in keyof Required<T>]: DeeplyRequired<T[K]>
    }
  : T

/** All fields are optional deeply  */
export type DeeplyPartial<T> = T extends {
  [key: string | number | symbol]: any
}
  ? {
      [K in keyof T]?: DeeplyPartial<T[K]>
    }
  : T
