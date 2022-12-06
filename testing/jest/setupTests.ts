import crypto from "crypto"
import { mockWebAudio } from "../mockWebAudio"
import { setGlobalProperty } from "../util/globals"

setGlobalProperty("crypto", {
  getRandomValues: (arr: Uint8Array) => crypto.randomBytes(arr.length),
})

mockWebAudio()
