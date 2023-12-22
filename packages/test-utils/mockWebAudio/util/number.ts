// Many values passed to the Web Audio API are converted to 32-bit integers before being processed.

export const convertSigned32Int = (value: unknown) => Number(value) << 0

export const convertUnsigned32Int = (value: unknown) => Number(value) >>> 0
