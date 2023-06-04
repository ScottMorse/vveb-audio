export const __ALLOWED = Symbol("allowed")

export class Worklet {
  constructor(_allowed: typeof __ALLOWED) {
    if (_allowed !== __ALLOWED) {
      throw new TypeError("Illegal constructor")
    }
  }

  addModule(_url: string): Promise<void> {
    return Promise.resolve()
  }
}

export const createMockWorklet = () => new Worklet(__ALLOWED)
