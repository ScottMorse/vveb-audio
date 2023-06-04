/** A script loaded to the user's page that provides utilities to the console. */

import { createLogger } from "@vveb-audio/core/logger"
import { createAudioNode } from "@@core/native"
import {
  createAudioContext,
  getCanAudioContextStartListener,
} from "@@core/native/audioContext"
import {
  ALL_AUDIO_NODES,
  CREATABLE_AUDIO_NODES,
} from "@@core/native/audioNode/audioNodes"
import { CreatableAudioNodeName } from "@@core/native/audioNode/createAudioNode"
import { discoverDefaultAudioParams } from "@@core/native/audioParam"

const logger = createLogger({
  contextName: "Dev User Script",
  printLevel: "debug",
})

interface VVUtils {
  rawContext: AudioContext
  rawOfflineContext: OfflineAudioContext
  rawDestination: AudioDestinationNode
  createNode(name: CreatableAudioNodeName, options: any): any
  NODES: {
    creatable: typeof CREATABLE_AUDIO_NODES
    all: typeof ALL_AUDIO_NODES
  }
  discoverDefaultAudioParams: typeof discoverDefaultAudioParams
  testNode: GainNode
  testParam: AudioParam
  resetTestNode(): void
  t: number
  time(offset: number): void
}

declare global {
  // eslint-disable-next-line no-var
  var vv: VVUtils
}

const run = () => {
  logger.info("Initialized")

  const listener = getCanAudioContextStartListener()

  const setGlobalContext = () => {
    const rawContext = createAudioContext("main")
    window.vv = new (class VV implements VVUtils {
      discoverDefaultAudioParams = discoverDefaultAudioParams

      NODES = {
        creatable: CREATABLE_AUDIO_NODES,
        all: ALL_AUDIO_NODES,
      }

      rawContext = rawContext

      rawDestination = rawContext.destination

      rawOfflineContext = new OfflineAudioContext(2, 48_000, 48_000)

      testNode = this.createNode("gain", { autoConnect: true })

      testParam = this.testNode.gain

      constructor() {
        let prevTestParamValue = this.testParam.value
        setInterval(() => {
          if (prevTestParamValue !== this.testParam.value) {
            logger.debug(`Test Param: ${this.testParam.value}`)
            prevTestParamValue = this.testParam.value
          }
        }, 250)
      }

      createNode<T extends CreatableAudioNodeName>(name: T, options: any) {
        const { autoConnect = true, ...nodeOptions } = options || {}
        const node = createAudioNode(
          name,
          rawContext,
          ...([nodeOptions] as any)
        )
        if (autoConnect) {
          node.connect(rawContext.destination)
        }
        return node
      }

      resetTestNode() {
        this.testNode.disconnect()
        this.testNode = this.createNode("gain", { autoConnect: true })
        this.testParam = this.testNode.gain
      }

      get t() {
        return rawContext.currentTime
      }

      time(offset: number) {
        return rawContext.currentTime + offset
      }
    })()

    logger.info(
      "Main context created and utilities initialized at window.vv",
      window.vv
    )
  }

  if (listener.canStart) {
    setGlobalContext()
  } else {
    listener.on("canStart", setGlobalContext)
  }
}

run()
