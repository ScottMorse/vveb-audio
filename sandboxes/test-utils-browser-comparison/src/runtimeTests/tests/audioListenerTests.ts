import { strict as assert } from "assert"
import { delay } from "@@core/internal/testing/delay"
import { Mock } from "../../lib/engine"
import { compareErrors } from "../../lib/util"
import { RuntimeTest } from "../runtimeTest"

const compareAudioParams = (
  context: BaseAudioContext,
  mockContext: Mock.BaseAudioContext,
  message: string,
  checkConstructorNames = false
) => {
  const prefix = message + " " + context.constructor.name + " "

  for (const prop of [
    "forwardX",
    "forwardY",
    "forwardZ",
    "positionX",
    "positionY",
    "positionZ",
    "upX",
    "upY",
    "upZ",
  ] as const) {
    if (checkConstructorNames) {
      assert.equal(
        prefix + prop + " is " + context.listener[prop].constructor.name,
        prefix + prop + " is " + mockContext.listener[prop].constructor.name
      )
    }
    for (const paramProp of [
      "value",
      "minValue",
      "maxValue",
      "defaultValue",
      "automationRate",
    ] as const) {
      assert.equal(
        prefix +
          prop +
          " " +
          paramProp +
          " = " +
          context.listener[prop][paramProp],
        prefix +
          prop +
          " " +
          paramProp +
          " = " +
          mockContext.listener[prop][paramProp]
      )
    }
  }
}

export const AUDIO_LISTENER_TESTS: RuntimeTest[] = [
  {
    name: "Cannot be instantiated directly",
    test: async ({ ctx }) => {
      compareErrors(
        () => new AudioListener(),
        () => new Mock.AudioListener(ctx)
      )
    },
  },
  {
    name: "Context listeners match properties",
    test: async ({ ctx, offlineCtx, mockCtx, mockOfflineCtx }) => {
      for (const [context, mockContext] of [
        [ctx, mockCtx] as const,
        [offlineCtx, mockOfflineCtx] as const,
      ]) {
        compareAudioParams(context, mockContext, "initial", true)
      }
    },
  },
  {
    name: "setOrientation",
    test: async ({ ctx, mockCtx }) => {
      const listener = ctx.listener
      const mockListener = mockCtx.listener

      listener.setOrientation(1, 2, 3, 4, 5, 6)
      mockListener.setOrientation(1, 2, 3, 4, 5, 6)

      await delay(100)

      compareAudioParams(ctx, mockCtx, "post setOrientation(1,2,3,4,5,6)")

      listener.setOrientation(7, 8, 9, 10, 11, 12)
      mockListener.setOrientation(7, 8, 9, 10, 11, 12)

      await delay(100)

      compareAudioParams(ctx, mockCtx, "post setOrientation(7,8,9,10,11,12)")
    },
  },
  {
    name: "setPosition",
    test: async ({ ctx, mockCtx }) => {
      const listener = ctx.listener
      const mockListener = mockCtx.listener

      listener.setPosition(1, 2, 3)
      mockListener.setPosition(1, 2, 3)

      await delay(100)

      compareAudioParams(ctx, mockCtx, "post setPosition(1,2,3)")

      listener.setPosition(4, 5, 6)
      mockListener.setPosition(4, 5, 6)

      await delay(100)

      compareAudioParams(ctx, mockCtx, "post setPosition(4,5,6)")
    },
  },
  {
    name: "setOrientation errors",
    test: async ({ ctx, mockCtx }) => {
      /* eslint-disable @typescript-eslint/ban-ts-comment */
      compareErrors(
        // @ts-ignore
        () => ctx.listener.setOrientation(),
        // @ts-ignore
        () => mockCtx.listener.setOrientation(),
        "no args"
      )

      compareErrors(
        // @ts-ignore
        () => ctx.listener.setOrientation(1, 2, 3),
        // @ts-ignore
        () => mockCtx.listener.setOrientation(1, 2, 3),
        "some args"
      )

      compareErrors(
        // @ts-ignore
        () => ctx.listener.setOrientation("hi", 2, 3, 4, 5, 6),
        // @ts-ignore
        () => mockCtx.listener.setOrientation("hi", 2, 3, 4, 5, 6),
        "string arg1"
      )

      compareErrors(
        // @ts-ignore
        () => ctx.listener.setOrientation(1, "hi", 3, 4, 5, 6),
        // @ts-ignore
        () => mockCtx.listener.setOrientation(1, "hi", 3, 4, 5, 6),
        "string arg2"
      )

      compareErrors(
        // @ts-ignore
        () => ctx.listener.setOrientation(1, 2, "hi", 4, 5, 6),
        // @ts-ignore
        () => mockCtx.listener.setOrientation(1, 2, "hi", 4, 5, 6),
        "string arg3"
      )

      compareErrors(
        // @ts-ignore
        () => ctx.listener.setOrientation(1, 2, 3, "hi", 5, 6),
        // @ts-ignore
        () => mockCtx.listener.setOrientation(1, 2, 3, "hi", 5, 6),
        "string arg4"
      )

      compareErrors(
        // @ts-ignore
        () => ctx.listener.setOrientation(1, 2, 3, 4, "hi", 6),
        // @ts-ignore
        () => mockCtx.listener.setOrientation(1, 2, 3, 4, "hi", 6),
        "string arg5"
      )

      compareErrors(
        // @ts-ignore
        () => ctx.listener.setOrientation(1, 2, 3, 4, 5, "hi"),
        // @ts-ignore
        () => mockCtx.listener.setOrientation(1, 2, 3, 4, 5, "hi"),
        "string arg6"
      )

      compareErrors(
        // @ts-ignore
        () => ctx.listener.setOrientation(null, 2, 3, 4, 5, 6, 7),
        // @ts-ignore
        () => mockCtx.listener.setOrientation(null, 2, 3, 4, 5, 6, 7),
        "null arg1"
      )

      compareErrors(
        // @ts-ignore
        () => ctx.listener.setOrientation(undefined, 2, 3, 4, 5, 6, 7),
        // @ts-ignore
        () => mockCtx.listener.setOrientation(undefined, 2, 3, 4, 5, 6, 7),
        "undefined arg1"
      )
      /* eslint-enable @typescript-eslint/ban-ts-comment */

      compareErrors(
        () => ctx.listener.setOrientation(Infinity, 2, 3, 4, 5, 6),
        () => mockCtx.listener.setOrientation(Infinity, 2, 3, 4, 5, 6),
        "infinity arg1"
      )

      compareErrors(
        () => ctx.listener.setOrientation(1, 2, Infinity, 4, 5, 6),
        () => mockCtx.listener.setOrientation(1, 2, Infinity, 4, 5, 6),
        "infinity arg3"
      )
    },
  },
  {
    name: "setPosition errors",
    test: async ({ ctx, mockCtx }) => {
      /* eslint-disable @typescript-eslint/ban-ts-comment */
      compareErrors(
        // @ts-ignore
        () => ctx.listener.setPosition(),
        // @ts-ignore
        () => mockCtx.listener.setPosition(),
        "no args"
      )

      compareErrors(
        // @ts-ignore
        () => ctx.listener.setPosition(1, 2, 3),
        // @ts-ignore
        () => mockCtx.listener.setPosition(1, 2, 3),
        "some args"
      )

      compareErrors(
        // @ts-ignore
        () => ctx.listener.setPosition("hi", 2, 3),
        // @ts-ignore
        () => mockCtx.listener.setPosition("hi", 2, 3),
        "string arg1"
      )

      compareErrors(
        // @ts-ignore
        () => ctx.listener.setPosition(1, "hi", 3),
        // @ts-ignore
        () => mockCtx.listener.setPosition(1, "hi", 3),
        "string arg2"
      )

      compareErrors(
        // @ts-ignore
        () => ctx.listener.setPosition(1, 2, "hi"),
        // @ts-ignore
        () => mockCtx.listener.setPosition(1, 2, "hi"),
        "string arg3"
      )

      compareErrors(
        // @ts-ignore
        () => ctx.listener.setPosition(null, 2, 3),
        // @ts-ignore
        () => mockCtx.listener.setPosition(null, 2, 3),
        "null arg1"
      )

      compareErrors(
        // @ts-ignore
        () => ctx.listener.setPosition(undefined, 2, 3),
        // @ts-ignore
        () => mockCtx.listener.setPosition(undefined, 2, 3),
        "undefined arg1"
      )
      /* eslint-enable @typescript-eslint/ban-ts-comment */

      compareErrors(
        () => ctx.listener.setPosition(Infinity, 2, 3),
        () => mockCtx.listener.setPosition(Infinity, 2, 3),
        "infinity arg1"
      )

      compareErrors(
        () => ctx.listener.setPosition(1, Infinity, 3),
        () => mockCtx.listener.setPosition(1, Infinity, 3),
        "infinity arg2"
      )
    },
  },
]
