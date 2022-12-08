export const setGlobalProperty = (
  key: string,
  value: any,
  target: Window | typeof globalThis = window
) => {
  Object.defineProperty(target, key, { value })
}

export const removeGlobalProperty = (
  key: string,
  target: Window | typeof globalThis = window
) => {
  delete target[key as keyof typeof target]
}
