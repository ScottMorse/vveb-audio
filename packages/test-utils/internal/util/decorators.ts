/** Decorator to override `toString` to common DOM format `"[object ExampleConstructorName]"` */
export const ConstructorNameToString: ClassDecorator = (target) => {
  target.prototype.toString = function () {
    return `[object ${this.constructor.name}]`
  }
}
