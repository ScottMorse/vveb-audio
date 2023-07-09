import { strict as assert } from "assert"
import { Mock } from "../../lib/engine"
import { compareErrors } from "../../lib/util"
import { RuntimeTest } from "../runtimeTest"

export const PERIODIC_WAVE_TESTS: RuntimeTest[] = [
  {
    name: "Constructor",
    test: async ({ ctx, mockCtx }) => {
      const wave = new PeriodicWave(ctx, {
        real: new Float32Array([1, 2, 3]),
        imag: new Float32Array([4, 5, 6]),
      })
      const mockWave = new Mock.PeriodicWave(
        mockCtx as unknown as AudioContext,
        {
          real: new Float32Array([1, 2, 3]),
          imag: new Float32Array([4, 5, 6]),
        }
      )

      assert.equal(wave.constructor.name, mockWave.constructor.name)
      assert.equal(wave.toString(), mockWave.toString())
    },
  },
  {
    name: "Constructor errors",
    test: async ({ ctx, mockCtx }) => {
      /* eslint-disable @typescript-eslint/ban-ts-comment */

      compareErrors(
        // @ts-ignore
        () => new PeriodicWave(),
        // @ts-ignore
        () => new Mock.PeriodicWave(),
        "no args"
      )

      compareErrors(
        // @ts-ignore
        () => new PeriodicWave(ctx),
        // @ts-ignore
        () => new Mock.PeriodicWave(mockCtx),
        "one arg"
      )

      compareErrors(
        // @ts-ignore
        () => new PeriodicWave("wrongType", {}),
        // @ts-ignore
        () => new Mock.PeriodicWave("wrongType", {}),
        "string arg1"
      )

      compareErrors(
        // @ts-ignore
        () => new PeriodicWave(ctx, "wrongType"),
        // @ts-ignore
        () => new Mock.PeriodicWave(mockCtx, "wrongType"),
        "string arg2"
      )

      compareErrors(
        // @ts-ignore
        () => new PeriodicWave(undefined, {}),
        // @ts-ignore
        () => new Mock.PeriodicWave(undefined, {}),
        "undefined arg1"
      )

      compareErrors(
        // @ts-ignore
        () => new PeriodicWave(null, {}),
        // @ts-ignore
        () => new Mock.PeriodicWave(null, {}),
        "null arg1"
      )

      compareErrors(
        // @ts-ignore
        () => new PeriodicWave(ctx, null),
        // @ts-ignore
        () => new Mock.PeriodicWave(mockCtx, null),
        "null arg2"
      )

      compareErrors(
        // @ts-ignore
        () => new PeriodicWave(ctx, { imag: {} }),
        // @ts-ignore
        () => new Mock.PeriodicWave(mockCtx, { imag: {} }),
        "non array imag"
      )

      compareErrors(
        // @ts-ignore
        () => new PeriodicWave(ctx, { real: {} }),
        // @ts-ignore
        () => new Mock.PeriodicWave(mockCtx, { real: {} }),
        "non array real"
      )

      compareErrors(
        // @ts-ignore
        () => new PeriodicWave(ctx, { real: "wrongType" }),
        // @ts-ignore
        () => new Mock.PeriodicWave(mockCtx, { real: "wrongType" }),
        "string real"
      )

      compareErrors(
        // @ts-ignore
        () => new PeriodicWave(ctx, { imag: "wrongType" }),
        // @ts-ignore
        () => new Mock.PeriodicWave(mockCtx, { imag: "wrongType" }),
        "string imag"
      )

      compareErrors(
        // @ts-ignore
        () => new PeriodicWave(ctx, { imag: null }),
        // @ts-ignore
        () => new Mock.PeriodicWave(mockCtx, { imag: null }),
        "null imag"
      )

      compareErrors(
        // @ts-ignore
        () => new PeriodicWave(ctx, { real: null }),
        // @ts-ignore
        () => new Mock.PeriodicWave(mockCtx, { real: null }),
        "null real"
      )

      compareErrors(
        // @ts-ignore
        () => new PeriodicWave(ctx, { real: "wrongType", imag: "wrongType" }),
        () =>
          new Mock.PeriodicWave(mockCtx, {
            // @ts-ignore
            real: "wrongType",
            // @ts-ignore
            imag: "wrongType",
          }),
        "imag and real string"
      )

      // string in imag array
      compareErrors(
        // @ts-ignore
        () => new PeriodicWave(ctx, { imag: ["wrongType", 1] }),
        // @ts-ignore
        () => new Mock.PeriodicWave(mockCtx, { imag: ["wrongType", 2] }),
        "string in imag array"
      )

      // string in real array
      compareErrors(
        // @ts-ignore
        () => new PeriodicWave(ctx, { real: ["wrongType", 1] }),
        // @ts-ignore
        () => new Mock.PeriodicWave(mockCtx, { real: ["wrongType", 2] }),
        "string in real array"
      )

      // string in both arrays
      compareErrors(
        () =>
          // @ts-ignore
          new PeriodicWave(ctx, {
            // @ts-ignore
            real: ["wrongType", 1],
            // @ts-ignore
            imag: ["wrongType", 1],
          }),
        () =>
          new Mock.PeriodicWave(mockCtx, {
            // @ts-ignore
            real: ["wrongType", 2],
            // @ts-ignore
            imag: ["wrongType", 2],
          }),
        "string in both arrays"
      )
      /* eslint-enable @typescript-eslint/ban-ts-comment */

      compareErrors(
        () =>
          new PeriodicWave(ctx, {
            real: [],
          }),
        () =>
          new Mock.PeriodicWave(mockCtx as any, {
            real: [],
          }),
        "empty real array"
      )

      compareErrors(
        () =>
          new PeriodicWave(ctx, {
            imag: [],
          }),
        () =>
          new Mock.PeriodicWave(mockCtx as any, {
            imag: [],
          }),
        "empty imag array"
      )

      compareErrors(
        () =>
          new PeriodicWave(ctx, {
            real: [],
            imag: [],
          }),
        () =>
          new Mock.PeriodicWave(mockCtx as any, {
            real: [],
            imag: [],
          }),
        "both real imag empty"
      )

      compareErrors(
        () =>
          new PeriodicWave(ctx, {
            real: [1],
            imag: [1],
          }),
        () =>
          new Mock.PeriodicWave(mockCtx as any, {
            real: [1],
            imag: [1],
          }),
        "both real imag length 1"
      )

      // non matching

      compareErrors(
        () =>
          new PeriodicWave(ctx, {
            real: [1, 2],
            imag: [1],
          }),
        () =>
          new Mock.PeriodicWave(mockCtx as any, {
            real: [1, 2],
            imag: [1],
          }),
        "real length 2 imag length 1"
      )

      compareErrors(
        () =>
          new PeriodicWave(ctx, {
            real: [1],
            imag: [1, 2],
          }),
        () =>
          new Mock.PeriodicWave(mockCtx as any, {
            real: [1],
            imag: [1, 2],
          }),
        "real length 1 imag length 2"
      )

      compareErrors(
        () =>
          new PeriodicWave(ctx, {
            real: [1, 2],
            imag: [1, 2, 3],
          }),
        () =>
          new Mock.PeriodicWave(mockCtx as any, {
            real: [1, 2],
            imag: [1, 2, 3],
          }),
        "real length 2 imag length 3"
      )
    },
  },
]
