import {
  WebAudioMember,
  WebAudioMemberName,
  WebAudioImplName,
} from "@@core/webAudio/api"

/** Metadata about every AudioNode subclass */
export const AUDIO_NODES = {
  analyser: {
    constructorName: "AnalyserNode",
    contextMethod: "createAnalyser",
    kind: ["effect", "destination"],
  },
  bufferSource: {
    constructorName: "AudioBufferSourceNode",
    contextMethod: "createBufferSource",
    kind: ["source"],
  },
  biquadFilter: {
    constructorName: "BiquadFilterNode",
    contextMethod: "createBiquadFilter",
    kind: ["effect"],
  },
  channelMerger: {
    constructorName: "ChannelMergerNode",
    contextMethod: "createChannelMerger",
    kind: ["effect"],
  },
  channelSplitter: {
    constructorName: "ChannelSplitterNode",
    contextMethod: "createChannelSplitter",
    kind: ["effect"],
  },
  constantSource: {
    constructorName: "ConstantSourceNode",
    contextMethod: "createConstantSource",
    kind: ["source"],
  },
  convolver: {
    constructorName: "ConvolverNode",
    contextMethod: "createConvolver",
    kind: ["effect"],
  },
  destination: {
    constructorName: "AudioDestinationNode",
    contextMethod: null,
    kind: ["destination"],
  },
  delay: {
    constructorName: "DelayNode",
    contextMethod: "createDelay",
    kind: ["effect"],
  },
  dynamicsCompressor: {
    constructorName: "DynamicsCompressorNode",
    contextMethod: "createDynamicsCompressor",
    kind: ["effect"],
  },
  gain: {
    constructorName: "GainNode",
    contextMethod: "createGain",
    kind: ["effect"],
  },
  iirFilter: {
    constructorName: "IIRFilterNode",
    contextMethod: "createIIRFilter",
    kind: ["effect"],
  },
  mediaElementSource: {
    constructorName: "MediaElementAudioSourceNode",
    contextMethod: "createMediaElementSource",
    kind: ["source"],
  },
  mediaStreamDestination: {
    constructorName: "MediaStreamAudioDestinationNode",
    contextMethod: "createMediaStreamDestination",
    kind: ["destination"],
  },
  mediaStreamSource: {
    constructorName: "MediaStreamAudioSourceNode",
    contextMethod: "createMediaStreamSource",
    kind: ["source"],
  },
  oscillator: {
    constructorName: "OscillatorNode",
    contextMethod: "createOscillator",
    kind: ["source"],
  },
  panner: {
    constructorName: "PannerNode",
    contextMethod: "createPanner",
    kind: ["effect"],
  },
  scheduledSource: {
    constructorName: "AudioScheduledSourceNode",
    contextMethod: null,
    kind: ["source"],
  },
  stereoPanner: {
    constructorName: "StereoPannerNode",
    contextMethod: "createStereoPanner",
    kind: ["effect"],
  },
  waveShaper: {
    constructorName: "WaveShaperNode",
    contextMethod: "createWaveShaper",
    kind: ["effect"],
  },
} as const

/**
 *  The type of the static metadata about each AudioNode subclass
 */
export type AudioNodes = typeof AUDIO_NODES

/**
 * This is used to group audio node subclasses by their kind
 * as described in the MDN, "source" nodes that take no input
 * and produce audio data, "effect" nodes that take input and
 * produce output, and "destination" nodes that take input and
 * produce no output.
 *
 * Some nodes may fall into multiple kinds, such as the AnalyserNode,
 * which can be used as a destination or an effect, since its output
 * is optional.
 */
export type AudioNodeKind = "source" | "effect" | "destination"

/**
 * The camelCase name of each AudioNode subclass as it is named in the Web Audio API,
 * such as "oscillator" for OscillatorNode or "biquadFilter" for BiquadFilterNode.
 *
 * This helps drive many core utilities by acting as an ID for the audio node type
 * that is independent of its implementation.
 *
 * @example
 *
 * const a: AudioNodeName = "oscillator"
 *
 * // The AudioDestinationnOde is only in the native implementation, not standardized-audio-context
 * const b: AudioNodeName<'native'> = 'destination'
 
 * // Specifies this must belong to the standardized-audio-context implementation
 * const c: AudioNodeName<'standardized'> = 'constantSource'
 * 
 * // Below will be an error, as the "destination" node is not in the standardized-audio-context
 * const error: AudioNodeName<'standardized'> = 'destination' 
 *
 */
export type AudioNodeName<W extends WebAudioImplName = WebAudioImplName> = {
  [K in keyof AudioNodes]: AudioNodes[K]["constructorName"] extends WebAudioMemberName<W>
    ? K
    : never
}[keyof AudioNodes]

/**
 * The name of an AudioNode subclass that can be directly instantiated.
 *
 * This excludes the "destination" node (the `AudioDestinationNode`),
 * as it cannot be instantiated directly, but can only be accessed via
 * an `AudioContext`'s `destination` property.
 *
 * @example
 *
 * const a: CreatableAudioNodeName = "oscillator"
 *
 * // b specifies the node must belong to the native implementation
 * const b: CreatableAudioNodeName<'native'> = "waveShaper"
 *
 * // c specifies the node must belong to the standardized-audio-context implementation
 * const c: CreatableAudioNodeName<'standardized'> = "constantSource"
 *
 * // Below is invalid, as the "destination" node cannot be instantiated directly
 * const error: CreatableAudioNodeName<'native'> = "destination"
 */
export type CreatableAudioNodeName<
  W extends WebAudioImplName = WebAudioImplName
> = Exclude<AudioNodeName<W>, "destination" | "scheduledSource">

/**
 * The type of the constructor function for a specific AudioNode subclass.
 * @example
 *
 * // For an OscillatorNode:
 * const a: AudioNodeConstructorName<'oscillator'> = 'OscillatorNode'
 *
 * // For a GainNode in the native Web Audio API:
 * const b: AudioNodeConstructorName<'gain', 'native'> = 'GainNode'
 *
 * // For a ConstantSourceNode in the standardized-audio-context:
 * const c: AudioNodeConstructorName<'constantSource', 'standardized'> = 'ConstantSourceNode'
 */
export type AudioNodeConstructorName<
  K extends AudioNodeName<W>,
  W extends WebAudioImplName = WebAudioImplName
> = AudioNodes[K]["constructorName"]

/**
 * The method name used on an AudioContext to create a specific type of AudioNode.
 *
 * @example
 *
 * // For an OscillatorNode:
 * const a: AudioNodeContextMethodName<'oscillator'> = "createOscillator"
 *
 * // For a GainNode in the native Web Audio API:
 * const b: AudioNodeContextMethodName<'gain', 'native'> = "createGain"
 *
 * // For a ConstantSourceNode in the standardized-audio-context:
 * const c: AudioNodeContextMethodName<'constantSource', 'standardized'> = "createConstantSource"
 */
export type AudioNodeContextMethodName<
  K extends CreatableAudioNodeName<W>,
  W extends WebAudioImplName = WebAudioImplName
> = AudioNodes[K]["contextMethod"]

type IsAudioDestinationNode<
  N extends AudioNodeName<W>,
  W extends WebAudioImplName
> = "native" extends W ? ("destination" extends N ? true : false) : false

type IsAudioScheduledSourceNode<
  N extends AudioNodeName<W>,
  W extends WebAudioImplName
> = "native" extends W ? ("scheduledSource" extends N ? true : false) : false

/** @todo may (likely) be possible to refactor these internal types to be less... horrific */
type UnCreatableConstructor<
  N extends AudioNodeName<W>,
  W extends WebAudioImplName
> = IsAudioDestinationNode<N, W> extends true
  ? IsAudioScheduledSourceNode<N, W> extends true
    ? typeof AudioScheduledSourceNode | typeof AudioDestinationNode
    : typeof AudioDestinationNode
  : IsAudioScheduledSourceNode<N, W> extends true
  ? typeof AudioScheduledSourceNode
  : never

type SafeMember<
  N extends AudioNodeName<W>,
  W extends WebAudioImplName
> = N extends CreatableAudioNodeName<W>
  ? WebAudioMember<AudioNodeConstructorName<N, W>, W>
  : never

/**
 * Represents the constructor for a particular AudioNode.
 * If the node is "destination", it specifically refers to the native AudioDestinationNode.
 * Otherwise, it refers to the corresponding constructor of the AudioNode, depending on the Web Audio API implementation specified.
 *
 * @example
 * import * as StandardizedAudioContext from "standardized-audio-context"
 *
 * // For an OscillatorNode:
 * const a: AudioNodeConstructor<'oscillator'> = OscillatorNode
 * // Since no implementation is specified, this also valid
 * const aAlt: AudioNodeConstructor<'oscillator'> = StandardizedAudioContext.OscillatorNode
 *
 * // For a GainNode in the native Web Audio API:
 * const b: AudioNodeConstructor<'gain', 'native'> = GainNode
 *
 * // For a ConstantSourceNode in the standardized-audio-context:
 * const c: AudioNodeConstructor<'constantSource', 'standardized'> = StandardizedAudioContext.ConstantSourceNode
 */
export type AudioNodeConstructor<
  N extends AudioNodeName<W>,
  W extends WebAudioImplName = WebAudioImplName
> = UnCreatableConstructor<N, W> | SafeMember<N, W>

/**
 * Represents an instance of a particular AudioNode. The specific type of the instance depends on the AudioNode name and the Web Audio API implementation.
 *
 * @example
 *
 * const context = new AudioContext()
 * const standardizedContext = new StandardizedAudioContext.AudioContext()
 *
 * // For an OscillatorNode:
 * const a: AudioNodeInstance<'oscillator'> = new OscillatorNode(context)
 *
 * // Below is also valid since no implementation is specified
 * const aAlt: AudioNodeInstance<'oscillator'> = new StandardizedAudioContext.OscillatorNode(standardizedContext)
 *
 * // For a GainNode in the native Web Audio API:
 * const b: AudioNodeInstance<'gain', 'native'> = context.createGain()
 *
 * // For a ConstantSourceNode in standardized-audio-context:
 * const c: AudioNodeInstance<'constantSource', 'standardized'> = new StandardizedAudioContext
 *  .ConstantSourceNode(standardizedContext)
 */
export type AudioNodeInstance<
  N extends AudioNodeName<W>,
  W extends WebAudioImplName = WebAudioImplName
> = InstanceType<AudioNodeConstructor<N, W>>

/**
 * Represents the options that can be passed to the constructor of a particular AudioNode.
 *
 * @example
 *
 * // For an OscillatorNode:
 * const a: AudioNodeOptions<'oscillator'> = { frequency: 440 }
 *
 * // For a GainNode in the native Web Audio API:
 * const b: AudioNodeOptions<'gain', 'native'> = {} // GainNode has no specific options
 *
 * // For a ConstantSourceNode in the standardized-audio-context:
 * const c: AudioNodeOptions<'constantSource', 'standardized'> = { offset: 1 }
 */
export type AudioNodeOptions<
  N extends AudioNodeName<W>,
  W extends WebAudioImplName = WebAudioImplName
> = ConstructorParameters<AudioNodeConstructor<N, W>>[1]

/**
 * Represents the name of an AudioNode subclass that matches a specific kind (source, effect, destination).
 *
 * @example
 *
 * // Valid source node names
 * const a: AudioNodeNameOfKind<'source'>[] = ['oscillator', 'bufferSource', 'mediaElementSource', 'mediaStreamSource']
 *
 * // Valid effect node names belonging to standardized-audio-context
 * const b: AudioNodeNameOfKind<'effect', 'standardized'>[] = ['analyser', 'biquadFilter', 'convolver', 'delay', 'dynamicsCompressor', 'gain', 'iirFilter', 'panner', 'waveShaper']
 *
 * // Valid destination node names belonging to the native Web Audio API
 * const c: AudioNodeNameOfKind<'destination', 'native'>[] = ['destination', 'analyser', 'mediaStreamDestination']
 */
export type AudioNodeNameOfKind<
  K extends AudioNodeKind,
  W extends WebAudioImplName = WebAudioImplName
> = {
  [N in AudioNodeName<W>]: K extends AudioNodes[N]["kind"][number] ? N : never
}[AudioNodeName<W>]

/**
 * Represents the constructor of an AudioNode subclass that matches a specific kind (source, effect, destination).
 *
 * @example
 *
 * import * as StandardizedAudioContext from 'standardized-audio-context';
 *
 * // Valid source nodes of either Web Audio API implementation
 * const a: AudioNodeConstructorOfKind<"source">[] = [
 *   OscillatorNode,
 *   StandardizedAudioContext.OscillatorNode,
 *   AudioBufferSourceNode,
 *   StandardizedAudioContext.AudioBufferSourceNode,
 *   MediaElementAudioSourceNode,
 *   StandardizedAudioContext.MediaElementAudioSourceNode,
 *   MediaStreamAudioSourceNode,
 *   StandardizedAudioContext.MediaStreamAudioSourceNode,
 * ]
 *
 * // Valid effect nodes belonging to standardized-audio-context
 * const b: AudioNodeConstructorOfKind<"effect", "standardized">[] = [
 *   StandardizedAudioContext.AnalyserNode,
 *   StandardizedAudioContext.BiquadFilterNode,
 *   StandardizedAudioContext.ConvolverNode,
 *   StandardizedAudioContext.DelayNode,
 *   StandardizedAudioContext.DynamicsCompressorNode,
 *   StandardizedAudioContext.GainNode,
 *   StandardizedAudioContext.IIRFilterNode,
 *   StandardizedAudioContext.PannerNode,
 *   StandardizedAudioContext.WaveShaperNode,
 * ]
 *
 * // Valid destination nodes belonging to the native Web Audio API
 * const c: AudioNodeConstructorOfKind<"destination", "native">[] = [
 *   AudioDestinationNode,
 *   AnalyserNode,
 *   MediaStreamAudioDestinationNode,
 * ]
 *
 */
export type AudioNodeConstructorOfKind<
  K extends AudioNodeKind,
  W extends WebAudioImplName = WebAudioImplName
> = AudioNodeConstructor<AudioNodeNameOfKind<K, W>, W>

/**
 * Represents an instance of an AudioNode subclass that matches a specific kind (source, effect, destination).
 *
 * @example
 *
 * import * as StandardizedAudioContext from 'standardized-audio-context';
 *
 * const context = new AudioContext()
 * const standardizedContext = new StandardizedAudioContext
 *   .AudioContext()
 *
 * // Valid source nodes
 * const a: AudioNodeInstanceOfKind<"source">[] = [
 *   new OscillatorNode(context),
 *   new AudioBufferSourceNode(context),
 *   new StandardizedAudioContext
 *    .OscillatorNode(standardizedContext),
 *   new StandardizedAudioContext
 *    .AudioBufferSourceNode(standardizedContext),
 * ]
 *
 * // Valid effect node instances belonging to standardized-audio-context
 * const b: AudioNodeInstanceOfKind<"effect", "standardized">[] = [
 *   new StandardizedAudioContext
 *    .AnalyserNode(standardizedContext),
 *   new StandardizedAudioContext
 *    .BiquadFilterNode(standardizedContext),
 *   new StandardizedAudioContext
 *    .ConvolverNode(standardizedContext),
 *   new StandardizedAudioContext
 *    .DelayNode(standardizedContext),
 *   new StandardizedAudioContext
 *    .DynamicsCompressorNode(standardizedContext),
 *   new StandardizedAudioContext
 *    .GainNode(standardizedContext),
 *   new StandardizedAudioContext
 *    .IIRFilterNode(standardizedContext, [1], [1]),
 *   new StandardizedAudioContext
 *    .PannerNode(standardizedContext),
 *   new StandardizedAudioContext
 *    .WaveShaperNode(standardizedContext),
 * ]
 *
 * // Valid destination node instances belonging to the native Web Audio API
 * const c: AudioNodeInstanceOfKind<"destination", "native">[] = [
 *   context.destination,
 *   new AnalyserNode(context),
 *   new MediaStreamAudioDestinationNode(context),
 * ]
 *
 */
export type AudioNodeInstanceOfKind<
  K extends AudioNodeKind,
  W extends WebAudioImplName = WebAudioImplName
> = AudioNodeInstance<AudioNodeNameOfKind<K, W>, W>
