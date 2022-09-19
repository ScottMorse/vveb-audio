import { useEffect } from "react"
import { useState } from "react"
import { createVirtualAudioGraph } from "vveb-audio/virtualAudioGraph"
import {
  renderAudioNode,
  RenderedAudioNode,
} from "vveb-audio/virtualAudioGraph/node/renderAudioNode"

const myGraph = createVirtualAudioGraph({
  node: "gain",
  options: {
    gain: 0.01,
  },
  inputs: [
    { node: "oscillator", options: { frequency: 440 } },
    { node: "oscillator", options: { frequency: 554.37586 } },
    { node: "oscillator", options: { frequency: 660 } },
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
          input.audioNode.start() /** @todo this type is erroneously any-ed */
        })
      } else {
        const ctx =
          new AudioContext() /** @todo should context type be part of v graph? */
        const node = renderAudioNode(myGraph.root, ctx)
        node.audioNode.connect(
          ctx.destination
        ) /** @todo need destination logic */
        setRenderedNode(node)
      }
    } else {
      renderedNode?.inputs.forEach((input) => {
        input.audioNode.stop() /** @todo this type is erroneously any-ed */
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
