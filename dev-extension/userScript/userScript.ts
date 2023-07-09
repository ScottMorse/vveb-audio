import { createLogger } from "@@core/logger"
import { AudioContextInstance, createEngine, Engine } from "@@core/webAudio"
import * as StandardizedAudioContext from "standardized-audio-context"
;(window as any).sac = StandardizedAudioContext

const logger = createLogger({
  contextName: "Dev User Script",
  printLevel: "debug",
})

/** Evaluates to an audio context's current time or can be called to get current time plus offset */
type Time = number & ((offset: number) => number)

const createTime = (context: AudioContextInstance) => {
  const time = (offset: number) => context.currentTime + offset

  return Object.assign(time, {
    valueOf: () => context.currentTime,
  }) as Time
}

interface VVUtils {
  ctx: AudioContextInstance<"live", "native">
  engine: Engine<"native">
  sac: typeof StandardizedAudioContext & {
    ctx: AudioContextInstance<"live", "standardized">
    engine: Engine<"standardized">
    t: Time
  }
  testNode: GainNode
  testParam: AudioParam
  t: Time
  resetTestNode(): void
}

declare global {
  // eslint-disable-next-line no-var
  var vv: VVUtils
}

const run = () => {
  logger.info("Script Initialized")

  const engine = createEngine()
  const sacEngine = createEngine({ api: "standardized" })

  let isInitialized = false
  const initialize = () => {
    logger.info(isInitialized ? "Utils updated" : "Utils initialized")

    isInitialized = true

    const ctx = engine.createContext()

    const createTestNode = () => {
      window.vv?.testNode?.disconnect()
      const node = engine.createAudioNode("gain", ctx)
      node.connect(ctx.destination)
      return node
    }

    const testNode = createTestNode()

    const sacCtx = sacEngine.createContext()

    window.vv = {
      ctx,
      engine,
      sac: {
        ...StandardizedAudioContext,
        ctx: sacCtx,
        engine: sacEngine,
        t: createTime(sacCtx),
      } as any,
      testNode,
      testParam: testNode.gain,
      t: createTime(ctx),
      resetTestNode: () => {
        window.vv.testNode = createTestNode()
      },
    }

    ctx.onstatechange = () => {
      ctx.state === "closed" && initialize()
    }
    sacCtx.onstatechange = () => {
      sacCtx.state === "closed" && initialize()
    }

    const runTestNodeWatcher = () => {
      let prevTestParamValue = vv.testParam.value
      setInterval(() => {
        if (prevTestParamValue !== vv.testParam.value) {
          logger.debug(`Test Param: ${vv.testParam.value}`)
          prevTestParamValue = vv.testParam.value
        }
      }, 250)
    }

    runTestNodeWatcher()
  }

  engine.onCanStart(() => {
    if(isInitialized) return
    logger.info("Contexts can start")
    initialize()
  })
}

try {
  run()
} catch (e) {
  logger.error(e as Error)
}
