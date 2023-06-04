const originalValues: { [key: string]: unknown } = {}

export type GlobalName = keyof typeof globalThis

export const setGlobalProperty = (key: string, value: any) => {
  if (originalValues[key] === undefined) {
    originalValues[key] = globalThis[key as GlobalName]
  }
  Object.defineProperty(globalThis, key, { value })
}

export const removeGlobalProperty = (...keys: string[]) => {
  for (const key of keys) {
    if (originalValues[key] === undefined && key !== "undefined") {
      delete globalThis[key as GlobalName]
    } else {
      setGlobalProperty(key, originalValues[key])
    }
  }
}
