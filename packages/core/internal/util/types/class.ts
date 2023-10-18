import { AnyFunction } from "./function"
import { KeyOfValueType } from "./keys"

export type ConcreteConstructor<
  Args extends any[] = any[],
  Instance = any
> = new (...args: Args) => Instance

export type AbstractConstructor<
  Args extends any[] = any[],
  Instance = any
> = abstract new (...args: Args) => Instance

/**
 *  The type of an un-instantiated class.
 *
 *  Note that this allows for either an abstract or concrete constructor,
 *  so separate types are available for only those.
 */
export type Constructor<Args extends any[] = any[], Instance = any> =
  | ConcreteConstructor<Args, Instance>
  | AbstractConstructor<Args, Instance>

export type MethodKeyName<Instance> = Exclude<
  KeyOfValueType<Instance, AnyFunction>,
  symbol | number | keyof typeof Object.prototype
>

type Overloads<T> = T extends {
  new (...args: infer A1): infer R1
  new (...args: infer A2): infer R2
  new (...args: infer A3): infer R3
  new (...args: infer A4): infer R4
}
  ? [
      new (...args: A1) => R1,
      new (...args: A2) => R2,
      new (...args: A3) => R3,
      new (...args: A4) => R4
    ]
  : T extends {
      new (...args: infer A1): infer R1
      new (...args: infer A2): infer R2
      new (...args: infer A3): infer R3
    }
  ? [new (...args: A1) => R1, new (...args: A2) => R2, new (...args: A3) => R3]
  : T extends {
      new (...args: infer A1): infer R1
      new (...args: infer A2): infer R2
    }
  ? [new (...args: A1) => R1, new (...args: A2) => R2]
  : T extends {
      new (...args: infer A1): infer R1
    }
  ? [new (...args: A1) => R1]
  : any

type OverloadedConstructorParametersList<T> = Overloads<T> extends infer O
  ? {
      [K in keyof O]: ConstructorParameters<
        Extract<O[K], new (...args: any) => any>
      >
    }
  : never

/**
 * Creates union type of up to four overloads of constructor parameters.
 *
 * Based on: https://stackoverflow.com/questions/59535995/parameters-generic-of-overloaded-function-doesnt-contain-all-options/59538756#59538756
 */
export type OverloadedConstructorParameters<T extends Constructor> =
  number extends keyof OverloadedConstructorParametersList<T>
    ? OverloadedConstructorParametersList<T>[number]
    : never
