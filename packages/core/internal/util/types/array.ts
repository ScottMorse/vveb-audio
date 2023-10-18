export type AnyArray<T> = Array<T> | ReadonlyArray<T>
export type ArrayItem<
  A extends AnyArray<any>,
  Index extends number = number
> = A[Index]

/**
 * A value that may be its type T or an array of T.
 * Useful for when a parameter is usually a single value
 * but optionally accepts an array.
 *
 * Use `resolveOptionalArray` to convert this value to an array.
 */
export type OptionalArray<
  T = any,
  IncludeReadonly extends boolean = false
> = IncludeReadonly extends true ? T | T[] | readonly T[] : T | T[]

export type ResolvedOptionalArray<T extends OptionalArray> =
  T extends (infer Item)[] ? Item[] : T[]

export type ResolvedOptionalArrayItem<T extends OptionalArray> =
  T extends (infer Item)[] ? Item : T