/* eslint-disable prefer-spread */
import { strict as assert } from "assert"
import {
  KeyOfValueType,
  AnyFunction,
  ConcreteConstructor,
  ExtractMethodParameters,
  ExtractMethodReturnType,
  OverloadedConstructorParameters,
  OptionalArray,
} from "@@core/internal/util/types"

export interface ComparisonOptions<T = any> {
  real: T
  mock: T
  name: string
  errors?: Error[]
}

const createCompare = () => {
  const errors = [] as Error[]
  return {
    errors,
    compare: (a: string, b: string, parentErrors?: Error[]) => {
      try {
        assert.equal(a, b)
      } catch (e) {
        ;(parentErrors ?? errors).push(e as Error)
      }
    },
  }
}

export interface CompareThrowOptions extends ComparisonOptions<() => unknown> {}

export const compareThrow = ({
  real,
  mock,
  name,
  errors,
}: CompareThrowOptions) => {
  const { errors: _errors, compare } = createCompare()
  errors = errors ?? _errors

  let error: Error | null = null
  let mockError: Error | null = null
  try {
    real()
  } catch (e) {
    error = e as Error
  }
  try {
    mock()
  } catch (e) {
    mockError = e as Error
  }

  const prefix = name ? name + ": " : ""

  if ((!error && mockError) || (error && !mockError)) {
    compare(
      prefix + "threw error: " + (error ? error.message : "(no error)"),
      prefix + "threw error: " + (mockError ? mockError.message : "(no error)"),
      errors
    )

    return { errors }
  }

  compare(
    prefix + "thrown error.message: " + error?.message,
    prefix + "thrown error.message: " + mockError?.message,
    errors
  )

  compare(
    prefix + "thrown error.name: " + error?.name,
    prefix + "thrown error.name: " + mockError?.name,
    errors
  )

  return { errors }
}

const compareStrings = <Value>(
  a: Value,
  b: Value,
  transform?: (value: Value) => string,
  parentErrors?: Error[]
) => {
  const { errors: _errors, compare } = createCompare()
  const errors = parentErrors ?? _errors

  transform = transform ?? String
  compare(transform(a), transform(b), errors)

  return { errors }
}

type NonFunctionKey<T> = Exclude<
  keyof T,
  KeyOfValueType<T, AnyFunction> | "prototype"
>

export interface CompareMethodOptions<
  M extends KeyOfValueType<T, AnyFunction>,
  T = any
> extends ComparisonOptions<T> {
  args: ExtractMethodParameters<T, M>
  method: M
  stringifyResult?(value: ExtractMethodReturnType<T, M>, instance: T): string
}

export const compareMethod = <
  M extends KeyOfValueType<T, AnyFunction>,
  T = any
>(
  options: CompareMethodOptions<M, T>
) => {
  const { compare, errors: _errors } = createCompare()
  const errors = options.errors ?? _errors

  const { real, mock, method, args } = options

  let realResult: ExtractMethodReturnType<T, M> | null = null
  try {
    realResult = (real[method] as any)(...args)
  } catch (e) {
    compareThrow({
      real: () => (real[method] as any)(...args),
      mock: () => (mock[method] as any)(...args),
      name: options.name,
      errors,
    })

    return { errors }
  }

  let mockResult: ExtractMethodReturnType<T, M> | null = null
  try {
    mockResult = (mock[method] as any)(...args)
  } catch (e) {
    compareThrow({
      real: () => (real[method] as any)(...args),
      mock: () => (mock[method] as any)(...args),
      name: options.name,
      errors,
    })

    return { errors }
  }

  const stringifyResult = (x: ExtractMethodReturnType<T, M>, inst: T) =>
    `${options.name} ${(options.stringifyResult ?? String)(x, inst)}`

  compare(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    stringifyResult(realResult!, real),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    stringifyResult(mockResult!, mock),
    errors
  )

  return { errors }
}

type MethodKeyName<T> = Exclude<
  KeyOfValueType<T, AnyFunction>,
  symbol | number | keyof typeof Object.prototype
>

export interface CompareInstanceOptions<T = any> extends ComparisonOptions<T> {
  /**
   * A map of properties to compare, mapping them to an optional function that createsa string that
   * is used for comparison between the real and mock instance properties. Otherwise results are
   * converted to their default string form for comparison.
   */
  props?: {
    [K in NonFunctionKey<T>]?: null | ((value: T[K]) => string)
  }
  /** A map of method names for comparing their results */
  methods?: {
    [K in MethodKeyName<T>]?: Pick<
      CompareMethodOptions<K, T>,
      "args" | "stringifyResult" | "name"
    >[]
  }
  /**
   * A similar map as the methods option, but any args array can be passed,
   * and compareThrow is used to compare the results. This is for ensuring
   * invalid args throw the same error in the real and mock instances.
   */
  errorMethods?: {
    [K in MethodKeyName<T>]?: Pick<
      CompareMethodOptions<any, T>,
      "args" | "name"
    >[]
  }
  /** To run after done with assertions */
  cleanup?: (instance: T) => void
}

export const compareInstance = <T = any>(
  options: CompareInstanceOptions<T>
) => {
  const errors = options.errors ?? []

  const { real, mock } = options

  const prefix = `${options.name ? options.name + ": " : ""}Compare ${
    real?.constructor.name
  } Instance: `

  compareStrings(
    real?.constructor.name,
    mock?.constructor.name,
    (v) => prefix + "Constructor Name: " + v,
    errors
  )

  compareStrings(String(real), String(mock), (v) => prefix + v, errors)

  for (const key of Object.keys(options?.props ?? {}) as NonFunctionKey<T>[]) {
    const realValue = real[key]
    const mockValue = mock[key]
    const stringify = options.props?.[key] || String
    compareStrings(
      realValue,
      mockValue,
      (v) => `${prefix}Prop '${key as string}': ${stringify(v)}`,
      errors
    )
  }

  for (const key of Object.keys(options?.methods ?? []) as MethodKeyName<T>[]) {
    const value = options.methods?.[key as keyof typeof options.methods]
    if (!value) continue
    for (const { args, name, stringifyResult } of value) {
      compareMethod({
        real,
        mock,
        name: `${prefix}Method '${String(key)}' (args list: '${name}'):`,
        method: key as keyof typeof options.methods,
        args,
        errors,
        stringifyResult,
      })
    }
  }

  for (const key of Object.keys(
    options?.errorMethods ?? {}
  ) as MethodKeyName<T>[]) {
    const value =
      options.errorMethods?.[key as keyof typeof options.errorMethods]
    if (!value) continue
    for (const { args, name } of value) {
      compareThrow({
        real: () => (real[key] as any)(...args),
        mock: () => (mock[key] as any)(...args),
        name: `${prefix}Error Method '${String(
          key
        )}' (error args list: '${name}')`,
        errors,
      })
    }
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    options.cleanup?.(real!)
  } catch (error) {
    console.warn("Failed to clean up real instance", { error, name })
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    options.cleanup?.(real!)
  } catch (error) {
    console.warn("Failed to clean up mock instance", { error, name })
  }

  return { errors }
}

/** @todo erroneous constructor and method args (can class be misused any other common way?) */
export interface CompareClassOptions<T extends ConcreteConstructor>
  extends Omit<CompareInstanceOptions<InstanceType<T>>, "real" | "mock"> {
  real: T
  mock: T
  constructorArgLists: {
    args: OverloadedConstructorParameters<T>
    name: string
  }[]
  errorConstructorArgLists?: { args: unknown[]; name: string }[]
}

export const compareClass = <T extends ConcreteConstructor>({
  constructorArgLists,
  errorConstructorArgLists,
  props,
  methods,
  errorMethods,
  name,
  real: Real,
  mock: Mock,
  errors = [],
  cleanup,
}: CompareClassOptions<T>) => {
  const clsName = Real.name

  for (const { args: _args, name: argsName } of constructorArgLists) {
    const args = _args as ConstructorParameters<T>[]
    let real: InstanceType<T> | null = null
    try {
      real = new Real(...args)
    } catch (e) {
      compareThrow({
        real: () => new Real(...args),
        mock: () => new Mock(...args),
        name: `${
          name ? name + ": " : ""
        }Compare class ${clsName} (args list: '${argsName}')`,
        errors,
      })
      continue
    }

    let mock: InstanceType<T> | null = null
    try {
      mock = new Mock(...args)
    } catch (e) {
      compareThrow({
        real: () => new Real(...args),
        mock: () => new Mock(...args),
        name: `${
          name ? name + ": " : ""
        }Compare class ${clsName} (args list: '${argsName}')`,
        errors,
      })
      continue
    }

    compareInstance({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      real: real!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      mock: mock!,
      props,
      name: `${
        name ? name + ": " : ""
      }Compare class ${clsName} (args list: '${argsName}')`,
      methods,
      errorMethods,
      errors,
      cleanup,
    })
  }

  for (const { args, name: argListName } of errorConstructorArgLists || []) {
    compareThrow({
      real: () => new (Real as any)(...args),
      mock: () => new (Mock as any)(...args),
      name: `${
        name ? name + ": " : ""
      }Compare class ${clsName} (error args list: '${argListName}')`,
      errors,
    })
  }

  return { errors }
}

/**
 * Create set of test args programmatically
 * that includes special numbers such as Infinity,
 * negative Infinity, NaN, etc.
 */
export const createCommonNumberTestArgs = <Output = any>(
  callback: (x: number) => OptionalArray<Output> | undefined,
  otherNumbersToInclude?: number[]
) =>
  [
    Infinity,
    -Infinity,
    NaN,
    0,
    -1,
    1,
    Number.MAX_SAFE_INTEGER,
    Number.MIN_SAFE_INTEGER,
    1.5,
    -1.5,
    ...(otherNumbersToInclude ?? []),
  ]
    .map(callback)
    .flatMap((x) => x)
    .filter((x) => x !== undefined) as Output[]

/**
 * Take an array of base arguments and create
 * a set of test args programmatically that replaces
 * each arg with a variety of values such as undefined,
 * null, NaN, etc.
 */
export const createVariedTypeArgs = <Output, Args extends unknown[]>(
  callback: (
    args: unknown[],
    value: unknown,
    argIndex: number
  ) => OptionalArray<Output> | undefined,
  fullBaseArgs: Args
) => {
  const values = [
    undefined,
    null,
    {},
    [],
    true,
    false,
    NaN,
    Infinity,
    -Infinity,
    "",
    "hello",
    1,
    0,
    -1,
    Number.MAX_SAFE_INTEGER,
    Number.MIN_SAFE_INTEGER,
    1.5,
    -1.5,
    function functionReturningVoid() {},
    Date,
    RegExp,
    new Date(),
    new RegExp(""),
    new Error(),
    new TypeError(),
  ]

  return fullBaseArgs
    .flatMap((_, i) => {
      const copy = [...fullBaseArgs]
      return values.map((value) => {
        copy[i] = value
        return callback(copy, value, i)
      })
    })
    .filter((x) => x !== undefined) as Output[]
}

/** Take a list of args and create new lists of args of lengths up to the give length - 1 */
export const createMissingArgs = <Output, Args extends unknown[]>(
  callback: (
    args: unknown[],
    upToIndex: number
  ) => OptionalArray<Output> | undefined,
  fullBaseArgs: Args
) => {
  return fullBaseArgs
    .flatMap((_, i) => {
      return callback(fullBaseArgs.slice(0, i), i)
    })
    .filter((x) => x !== undefined) as Output[]
}
