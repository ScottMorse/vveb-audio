import { strict as assert } from "assert"

export const compareErrors = (
  callback: () => void,
  mockCallback: () => void,
  name = ""
) => {
  let error: Error | null = null
  let mockError: Error | null = null
  try {
    callback()
  } catch (e) {
    error = e as Error
  }
  try {
    mockCallback()
  } catch (e) {
    mockError = e as Error
  }

  const prefix = name ? name + " " : ""
  assert.equal(
    prefix + "error.message: " + error?.message,
    prefix + "error.message: " + mockError?.message
  )
  const messagePreview =
    "(" +
    error?.constructor.name +
    ": " +
    error?.message?.slice(0, 20).trim() +
    "..." +
    error?.message?.slice(-20).trim() +
    "): "

  assert.equal(
    prefix +
      "error.constructor.name" +
      messagePreview +
      error?.constructor.name,
    prefix +
      "error.constructor.name" +
      messagePreview +
      mockError?.constructor.name
  )

  assert.equal(
    prefix + "error.name " + messagePreview + error?.name,
    prefix + "error.name " + messagePreview + mockError?.name
  )
}
