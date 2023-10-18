import { delay } from "@@core/internal/testing/delay"
import { AppState } from "src/lib/appContext"
import { compareInstance } from "src/lib/testUtils"
import { TestGroupConfig } from "../testGroupConfig"

const createTestParam = (ctx: AudioContext) => {
  const node = ctx.createStereoPanner()
  return { node, param: node.pan }
}

const safeClose = (ctx: AudioContext) => {
  try {
    ctx.close()
  } catch (error) {
    // ignore
  }
}

export interface CreateCompareParamsOptions {
  param: AudioParam
  mockParam: AudioParam
  errors: Error[]
  name: string
}

const createCompareParams =
  ({ param, mockParam, errors, name }: CreateCompareParamsOptions) =>
  (assertionName: string) =>
    compareInstance({
      mock: mockParam,
      real: param,
      errors,
      name: `${name} ${assertionName}`,
      props: {
        automationRate: null,
        defaultValue: null,
        maxValue: null,
        minValue: null,
        value: null,
      },
    })

export interface SetupTestContext {
  ctx: AudioContext
  mockCtx: AudioContext
  param: AudioParam
  node: AudioNode
  mockParam: AudioParam
  mockNode: AudioNode
  errors: Error[]
  compareParams: ReturnType<typeof createCompareParams>
}

const setupTest =
  (callback: (context: SetupTestContext) => Promise<void> | void) =>
  async ({ mockWebAudio }: AppState) => {
    const errors: Error[] = []
    const ctx = new AudioContext()
    const mockCtx = new mockWebAudio.api.AudioContext()
    const { param, node } = createTestParam(ctx)
    const { param: mockParam, node: mockNode } = createTestParam(mockCtx)

    const testContext = {
      ctx,
      mockCtx,
      param,
      node,
      mockParam,
      mockNode,
      errors,
      compareParams: createCompareParams({
        param,
        mockParam,
        errors,
        name: "Unconnected",
      }),
    }

    try {
      await callback(testContext)
    } catch (error) {
      return { errors: [error as Error] }
    }

    node.connect(ctx.destination)
    mockNode.connect(mockCtx.destination)

    try {
      await callback({
        ...testContext,
        compareParams: createCompareParams({
          param,
          mockParam,
          errors,
          name: "Connected",
        }),
      })
    } catch (error) {
      return { errors: [error as Error] }
    }

    safeClose(ctx)
    safeClose(mockCtx)

    return { errors }
  }

export const AUDIO_PARAM_TEST_GROUP: TestGroupConfig = {
  name: "AudioParam",
  tests: {
    suspendedCtxSetValue: {
      name: "Suspended context: set value",
      run: setupTest(({ mockParam, param, ctx, mockCtx, compareParams }) => {
        ctx.suspend()
        mockCtx.suspend()

        param.setValueAtTime(0.5, 0)
        mockParam.setValueAtTime(0.5, 0)

        compareParams("setValueAtTime(0.5, 0)")

        param.setValueAtTime(0.5, 1)
        mockParam.setValueAtTime(0.5, 1)

        compareParams("setValueAtTime(0.5, 1)")

        param.value = 10
        mockParam.value = 10

        compareParams("value = 10")

        param.setValueAtTime(1, 0)
        mockParam.setValueAtTime(1, 0)

        compareParams("setValueAtTime(1, 0)")

        param.value = 0.5
        mockParam.value = 0.5

        compareParams("value = 0.5")
      }),
    },
    runningCtxSetValue: {
      name: "Running context: set value",
      run: setupTest(({ mockParam, param, compareParams }) => {
        param.setValueAtTime(0.5, 0)
        mockParam.setValueAtTime(0.5, 0)

        compareParams("setValueAtTime(0.5, 0)")

        param.setValueAtTime(0.5, 1)
        mockParam.setValueAtTime(0.5, 1)

        compareParams("setValueAtTime(0.5, 1)")

        param.value = 10
        mockParam.value = 10

        compareParams("value = 10")

        param.setValueAtTime(1, 0)
        mockParam.setValueAtTime(1, 0)

        compareParams("setValueAtTime(1, 0)")

        param.value = 0.5
        mockParam.value = 0.5

        compareParams("value = 0.5")
      }),
    },
    setValueInPast: {
      name: "Set value in past",
      run: setupTest(async ({ mockParam, param, compareParams }) => {
        await delay(1000)

        param.setValueAtTime(0.5, 0.25)
        mockParam.setValueAtTime(0.5, 0.25)

        compareParams("setValueAtTime(0.5, 0.25)")
      }),
    },
    setValueInPastConflicts: {
      name: "Set value in past with conflicts",
      run: setupTest(async ({ mockParam, param, compareParams }) => {
        await delay(1000)

        param.setValueAtTime(0.5, 0.25)
        mockParam.setValueAtTime(0.5, 0.25)

        compareParams("setValueAtTime(0.5, 0.25)")

        param.setValueAtTime(0.75, 0.25)
        mockParam.setValueAtTime(0.75, 0.25)

        compareParams("setValueAtTime(0.75, 0.25)")

        param.setValueAtTime(0.25, 0.25)
        mockParam.setValueAtTime(0.25, 0.25)

        compareParams("setValueAtTime(0.25, 0.25)")

        param.setValueAtTime(0.3, 0.5)
        mockParam.setValueAtTime(0.3, 0.5)

        compareParams("setValueAtTime(0.3, 0.5)")

        param.setValueAtTime(0.4, 0.5)
        mockParam.setValueAtTime(0.4, 0.5)

        compareParams("setValueAtTime(0.4, 0.5)")

        param.setValueAtTime(0.2, 0.45)
        mockParam.setValueAtTime(0.2, 0.45)

        compareParams("setValueAtTime(0.2, 0.45)")
      }),
    },
    setValueInFuture: {
      name: "Set value in future",
      run: setupTest(async ({ mockParam, param, ctx, compareParams }) => {
        const time = ctx.currentTime + 0.25

        param.setValueAtTime(0.123, time)
        mockParam.setValueAtTime(0.123, time)

        compareParams(`setValueAtTime(0.123, ${time})`)

        await delay(1000)

        compareParams(`setValueAtTime(0.123, ${time}) after 1s`)
      }),
    },
  },
}
