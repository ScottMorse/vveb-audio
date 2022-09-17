export type AnyArray<T> = Required<Array<T> | ReadonlyArray<T>>
export type ArrayItem<
  A extends AnyArray<any>,
  Index extends number = number
> = A[Index]
