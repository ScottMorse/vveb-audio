/** @todo basic tests */
export const resolveArrayArg = <T>(arg: T | T[]): T[] =>
  Array.isArray(arg) ? arg : [arg]
