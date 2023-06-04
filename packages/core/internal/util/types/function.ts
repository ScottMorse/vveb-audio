export type AnyFunction = (...args: any[]) => any

export type Func<Args extends any[] = any[], Return = any> = (
  ...args: Args
) => Return
