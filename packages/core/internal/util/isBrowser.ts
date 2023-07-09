export const getIsBrowser = () => typeof window === "object"

export const assertIsBrowser = (message?: string) => {
  if (!getIsBrowser()) {
    throw new Error(
      message || "Browser environment expected. No window object found."
    )
  }
}
