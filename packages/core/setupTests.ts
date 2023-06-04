import crypto from "crypto"
import "@testing-library/jest-dom/extend-expect"

Object.assign(globalThis, "crypto", {
  getRandomValues: (arr: Uint8Array) => crypto.randomBytes(arr.length),
})
