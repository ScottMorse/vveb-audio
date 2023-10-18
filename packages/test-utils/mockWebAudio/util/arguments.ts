import { ConcreteConstructor } from "@@test-utils/../core/internal/util/types"

const createArgumentsWord = (argCount: number) =>
  argCount === 1 ? "argument" : "arguments"

export const ValidateClassArgsLength = (required: number) => {
  return function (originalConstructor: ConcreteConstructor) {
    const newConstructor: any = function (...args: any[]) {
      if (args.length < required) {
        throw new TypeError(
          `Failed to construct '${
            originalConstructor.name
          }': ${required} ${createArgumentsWord(required)} required, but only ${
            args.length
          } present.`
        )
      }
      const instance = new originalConstructor(...args)
      return instance
    }

    // Set prototypes for inheritance
    Object.setPrototypeOf(newConstructor, originalConstructor)
    Object.setPrototypeOf(
      newConstructor.prototype,
      originalConstructor.prototype
    )

    return newConstructor
  }
}

export const ValidateMethodArgsLength = (required: number): MethodDecorator => {
  return (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value
    ;(descriptor as any).value = function (...args: any[]) {
      if (args.length < required) {
        throw new TypeError(
          `Failed to execute '${String(propertyKey)}' on '${
            target.constructor.name
          }': ${required} ${createArgumentsWord(required)} required, but only ${
            args.length
          } present.`
        )
      }
      return (originalMethod as any).apply(this, args)
    }
  }
}
