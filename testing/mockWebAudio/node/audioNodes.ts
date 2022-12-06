import { setGlobalProperty } from "../../util/globals"
import { AudioNode } from "./mockAudioNode"

export const AUDIO_NODE_KEYS = [
  "AnalyserNode",
  "AudioBufferSourceNode",
  "AudioDestinationNode",
  "AudioScheduledSourceNode",
  "AudioWorkletNode",
  "BiquadFilterNode",
  "ChannelMergerNode",
  "ChannelSplitterNode",
  "ConstantSourceNode",
  "ConvolverNode",
  "DelayNode",
  "DynamicsCompressorNode",
  "GainNode",
  "IIRFilterNode",
  "MediaElementAudioSourceNode",
  "MediaStreamAudioDestinationNode",
  "MediaStreamAudioSourceNode",
  "OscillatorNode",
  "PannerNode",
  "ScriptProcessorNode",
  "StereoPannerNode",
  "WaveShaperNode",
]

export const mockWindowAudioNodes = () => {
  setGlobalProperty("AudioNode", AudioNode)

  for (const node of AUDIO_NODE_KEYS) {
    setGlobalProperty(node, class extends AudioNode {})
  }
}
