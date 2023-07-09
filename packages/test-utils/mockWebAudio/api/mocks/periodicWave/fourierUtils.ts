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

export type FourierCoefficientInvalidReason = Exclude<
  ReturnType<typeof getIsFourierCoefficientValid>["reason"],
  null
>
