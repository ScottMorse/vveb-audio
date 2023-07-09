export const MockConstructorName =
  (name: string): ClassDecorator =>
  (target) => {
    Object.defineProperty(target, "name", { value: name })
    target.prototype.toString = () => `[object ${name}]`
  }
