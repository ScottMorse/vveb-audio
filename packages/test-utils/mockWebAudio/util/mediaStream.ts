import { customAlphabet } from "nanoid"

const nanoid = customAlphabet("1234567890abcdef", 16)

export const createStreamId = () =>
  `${nanoid(8)}-${nanoid(4)}-${nanoid(4)}-${nanoid(4)}-${nanoid(12)}`

export const createGroupId = () => nanoid(64)
