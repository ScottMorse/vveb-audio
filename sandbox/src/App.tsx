import { useEffect, useRef } from "react"
import { useState } from "react"
import { Logger, setVVebLogLevel } from "vveb-audio/lib/logger"
import { getCanAudioContextStartListener } from "vveb-audio/nativeWebAudio"
import { createVirtualAudioGraph } from "vveb-audio/virtualAudioGraph"

setVVebLogLevel("debug")

const myGraph = createVirtualAudioGraph({
  id: "my-graph",
  root: {
    defaultDestination: true,
    inputs: [
      {
        node: {
          id: "gain",
          name: "gain",
          options: {
            gain: 0.01,
          },
          inputs: [
            {
              node: {
                id: "osc1",
                name: "oscillator",
                options: { frequency: 440 },
              },
            },
            {
              node: {
                id: "osc2",
                name: "oscillator",
                params: {
                  frequency: {
                    value: 554.37586,
                  },
                },
              },
            },
            {
              node: {
                id: "osc3",
                name: "oscillator",
                options: { frequency: 660 },
              },
            },
          ],
        },
      },
    ],
  },
  context: { id: "my-context", name: "default" },
  autoRender: true,
})

;(window as any).graph = myGraph

const listener = getCanAudioContextStartListener()

export const App = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const canStartRef = useRef(listener.canStart)

  useEffect(() => {
    if (!canStartRef.current) {
      listener.on("canStart", () => {
        canStartRef.current = true
      })
    }
  }, [])

  useEffect(() => {
    if (isPlaying) {
      setTimeout(() => {
        if (canStartRef.current) {
          myGraph.getNodes({ name: "oscillator" }).forEach((node) => {
            node.start()
            node.params.frequency.setValueAtTime(
              256,
              myGraph.context.audioContext!.currentTime + 2
            )
          })
        }
      })
    } else {
      myGraph
        .getNodes({ kind: "source" })
        .forEach((node) => node.isPlaying && node.stop())
    }
  }, [isPlaying])

  return (
    <div>
      VVeb Audio{" "}
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? "Stop" : "Start"}
      </button>
    </div>
  )
}
;(window as any).logger = new Logger()
