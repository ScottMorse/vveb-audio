export type AnyArray<T> = Array<T> | ReadonlyArray<T>
export type ArrayItem<
  A extends AnyArray<any>,
  Index extends number = number
> = A[Index]
