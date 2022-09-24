import { useEffect } from "react"
import { useState } from "react"
import { createVirtualAudioGraph } from "vveb-audio/virtualAudioGraph"
import {
  renderAudioNode,
  RenderedAudioNode,
} from "vveb-audio/virtualAudioGraph/node/renderAudioNode"

const myGraph = createVirtualAudioGraph({
  name: "gain",
  options: {
    gain: 0.01,
  },
  inputs: [
    { name: "oscillator", options: { frequency: 440 } },
    { name: "oscillator", options: { frequency: 554.37586 } },
    { name: "oscillator", options: { frequency: 660 } },
  ],
})

export const App = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [renderedNode, setRenderedNode] =
    useState<RenderedAudioNode<any> | null>(null)

  useEffect(() => {
    if (isPlaying) {
      if (renderedNode) {
        renderedNode.inputs.forEach((input) => {
          if (input.audioNode instanceof OscillatorNode) {
            input.audioNode.start()
          }
        })
      } else {
        const ctx =
          new AudioContext() /** @todo should context type be part of v graph? */
        const node = renderAudioNode(myGraph.roots[0].virtualNode, ctx)
        node.audioNode.connect(
          ctx.destination
        ) /** @todo need destination logic */
        setRenderedNode(node)
      }
    } else {
      renderedNode?.inputs.forEach((input) => {
        if (input.audioNode instanceof OscillatorNode) {
          input.audioNode.stop()
        }
      })
      setRenderedNode(null)
    }
  }, [isPlaying, renderedNode])

  return (
    <div>
      VVeb Audio{" "}
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? "Stop" : "Start"}
      </button>
    </div>
  )
}
