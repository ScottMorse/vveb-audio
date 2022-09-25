import { useEffect, useRef } from "react"
import { useState } from "react"
import { getCanAudioContextStartListener } from "vveb-audio/nativeWebAudio"
import { createVirtualAudioGraph } from "vveb-audio/virtualAudioGraph"

const myGraph = createVirtualAudioGraph({
  defaultDestination: true,
  inputs: [
    {
      name: "gain",
      options: {
        gain: 0.01,
      },
      inputs: [
        { name: "oscillator", options: { frequency: 440 } },
        { name: "oscillator", options: { frequency: 554.37586 } },
        { name: "oscillator", options: { frequency: 660 } },
      ],
    },
  ],
})

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
          myGraph.render()
          myGraph
            .getNodes({ kind: "source" }) /** @todo This filter is broken */
            .forEach((node) => (node?.audioNode as OscillatorNode)?.start?.())
        }
      })
    } else {
      myGraph
        .getNodes({ kind: "source" })
        .forEach((node) => (node?.audioNode as OscillatorNode)?.stop?.())
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
