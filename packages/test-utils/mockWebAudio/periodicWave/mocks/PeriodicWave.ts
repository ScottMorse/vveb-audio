import { ConstructorNameToString } from "../../../internal/util/decorators"
import {
  NativeBaseAudioContext,
  NativePeriodicWave,
} from "../../../internal/util/nativeTypes"
import { BaseAudioContext } from "../../audioContext"

export const getIsFourierCoefficientValid = (value: any) => {
  if (
    value !== undefined &&
    // like the Blob constructor, the PeriodicWave treats strings as non-iterables
    (typeof value === "string" || !value?.[Symbol.iterator])
  ) {
    return { isValid: false, reason: "noIterator" } as const
  }

  if (value) {
    for (const x of value) {
      if (!isFinite(Number(x))) {
        return { isValid: false, reason: "nonFinite" } as const
      }
    }
    if (value.length < 2) {
      return { isValid: false, reason: "badLength" } as const
    }
  }
  return { isValid: true, reason: null } as const
}

type Reason = ReturnType<typeof getIsFourierCoefficientValid>["reason"]

const throwReasonError = (
  value: any,
  name: "imag" | "real",
  reason: Reason
) => {
  switch (reason) {
    case "noIterator":
      throw new TypeError(
        !!value && typeof value === "object"
          ? `Failed to construct 'PeriodicWave': Failed to read the '${name}' property from 'PeriodicWaveOptions': The object must have a callable @@iterator property.`
          : `Failed to construct 'PeriodicWave': Failed to read the '${name}' property from 'PeriodicWaveOptions': The provided value cannot be converted to a sequence.`
      )
    case "badLength":
      throw new DOMException(
        `Failed to construct 'PeriodicWave': The length of the real array provided (${value.length}) is less than the minimum bound (2).`,
        "IndexSizeError"
      )
    case "nonFinite":
      throw new TypeError(
        `Failed to construct 'PeriodicWave': Failed to read the '${name}' property from 'PeriodicWaveOptions': The provided float value is non-finite.`
      )
  }
}

@ConstructorNameToString
export class PeriodicWave implements NativePeriodicWave {
  // implement constructor args and validate them
  constructor(context: NativeBaseAudioContext, options?: PeriodicWaveOptions) {
    if (arguments.length === 0) {
      throw new TypeError(
        "Failed to construct 'PeriodicWave': 1 argument required, but only 0 present."
      )
    }

    if (!(context instanceof BaseAudioContext)) {
      throw new TypeError(
        "Failed to construct 'PeriodicWave': parameter 1 is not of type 'BaseAudioContext'."
      )
    }

    if (!options) return

    if (typeof options !== "object") {
      throw new TypeError(
        "Failed to construct 'PeriodicWave': The provided value is not of type 'PeriodicWaveOptions'."
      )
    }

    const { reason: imagReason } = getIsFourierCoefficientValid(options.imag)
    const { reason: realReason } = getIsFourierCoefficientValid(options.real)

    // conditions got convoluted matching the error precedence in the browser
    if (
      options.imag &&
      options.real &&
      ((imagReason === "badLength" && !realReason) ||
        (realReason === "badLength" && !imagReason) ||
        (!imagReason && !realReason)) &&
      options.imag?.length !== options.real?.length
    ) {
      throw new DOMException(
        `Failed to construct 'PeriodicWave': length of real array (${options.real.length}) and length of imaginary array (${options.imag.length}) must match.`,
        "IndexSizeError"
      )
    }

    throwReasonError(options.imag, "imag", imagReason)
    throwReasonError(options.real, "real", realReason)
  }
}
