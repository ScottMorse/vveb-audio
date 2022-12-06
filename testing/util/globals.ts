export const setGlobalProperty = (key: string, value: any) => {
  Object.defineProperty(window, key, { value })
}
