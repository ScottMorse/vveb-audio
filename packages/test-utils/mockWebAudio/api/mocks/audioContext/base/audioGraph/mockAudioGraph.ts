import { MockWebAudioApi } from "@@test-utils/mockWebAudio/api/mockApiType"
import { isInstanceType } from "@@test-utils/mockWebAudio/util/instanceType"

interface GraphNode {
  value: AudioNode | AudioParam
  context: BaseAudioContext
  inputs: Record<number, GraphNode[]>
  outputs: Record<number, GraphNode[]>
  isRoot: boolean
}

const GRAPH_NODE_MAP = new WeakMap<AudioNode | AudioParam, GraphNode>()

const createPinMap = (numberOfPins: number) => {
  const pinMap: Record<number, GraphNode[]> = {}

  for (let i = 0; i < numberOfPins; i++) {
    pinMap[i] = []
  }

  return pinMap
}

export const registerGraphNode = (
  node: AudioNode | AudioParam,
  context: BaseAudioContext,
  mockApi: MockWebAudioApi,
  isRoot = false
) => {
  if (GRAPH_NODE_MAP.has(node)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return GRAPH_NODE_MAP.get(node)!
  }

  const newNode: GraphNode = {
    value: node,
    context,
    inputs: createPinMap(
      isInstanceType(node, "AudioNode", mockApi) ? node.numberOfInputs : 1
    ),
    outputs: createPinMap(
      isInstanceType(node, "AudioNode", mockApi) ? node.numberOfOutputs : 0
    ),
    isRoot,
  }

  GRAPH_NODE_MAP.set(node, newNode)

  return newNode
}

export interface ConnectGraphNodeOptions {
  source: AudioNode
  destination: AudioNode | AudioParam
  context: BaseAudioContext
  output?: number
  input?: number
}

export interface DisconnectGraphNodeOptions
  extends Omit<ConnectGraphNodeOptions, "destination"> {
  /** When a number is passed, this is the OUTPUT index of the SOURCE NODE to be disconnected from all connected inputs of its previous destinations */
  destination: AudioNode | AudioParam | number | null | undefined
}

export const AUDIO_GRAPH_VALIDATION_ERRORS = {
  contextMisMatch: "Nodes do not belong to the same BaseAudioContext",
  inputOutsideRange: "Input is outside of range",
  outputOutsideRange: "Output is outside of range",
  nodeNotConnected: "Nodes are not connected",
  outputNotConnected: "Output is not connected",
}

export const validateConnectGraphNode = ({
  source,
  destination,
  context,
  output = 0,
  input = 0,
}: ConnectGraphNodeOptions) => {
  const sourceNode = getGraphNode(source)
  const destinationNode = getGraphNode(destination)

  if (sourceNode.context !== context || destinationNode.context !== context) {
    return AUDIO_GRAPH_VALIDATION_ERRORS.contextMisMatch
  }

  if (
    output < 0 ||
    output >= ((sourceNode.value as AudioNode)?.numberOfOutputs ?? 0)
  ) {
    return AUDIO_GRAPH_VALIDATION_ERRORS.outputOutsideRange
  }

  if (
    input < 0 ||
    input >= ((destinationNode.value as AudioNode)?.numberOfInputs ?? 0)
  ) {
    return AUDIO_GRAPH_VALIDATION_ERRORS.inputOutsideRange
  }
}

const wrapValidation =
  <Options>(
    validate: (options: Options) => string | undefined,
    cb: (options: Options) => void
  ) =>
  (options: Options) => {
    const error = validate(options as Options)
    if (error) {
      console.error(new Error(error), { options })
      return
    }

    cb(options as Options)
  }

const addNode = (
  pinMap: Record<number, GraphNode[]>,
  pinIndex: number | undefined,
  node: GraphNode
) => {
  pinIndex = pinIndex ?? 0
  if (!pinMap[pinIndex].includes(node)) {
    pinMap[pinIndex].push(node)
  }
}

export const connectGraphNode = wrapValidation(
  validateConnectGraphNode,
  (options: ConnectGraphNodeOptions) => {
    const sourceNode = getGraphNode(options.source)
    const destinationNode = getGraphNode(options.destination)

    addNode(sourceNode.outputs, options.output, destinationNode)
    addNode(destinationNode.inputs, options.input, sourceNode)
  }
)

const removeNode = (
  pinMap: Record<number, GraphNode[]>,
  pinIndex: number | undefined,
  node: GraphNode
) => {
  pinIndex = pinIndex ?? 0
  pinMap[pinIndex].splice(pinMap[pinIndex].indexOf(node), 1)
}

const getDestinationNodesToDisconnect = (
  source: GraphNode,
  destination: AudioParam | AudioNode | number | null | undefined
) =>
  typeof destination === "number"
    ? source.outputs[destination] ?? []
    : !destination
    ? Object.values(source.outputs).flatMap((x) => x)
    : [getGraphNode(destination)]

export const validateDisconnectGraphNode = ({
  source,
  destination,
  output = 0,
  input = 0,
}: DisconnectGraphNodeOptions) => {
  const sourceNode = getGraphNode(source)

  if (
    destination &&
    typeof destination === "object" &&
    !sourceNode.outputs[output].find((node) => node.value === destination)
  ) {
    return AUDIO_GRAPH_VALIDATION_ERRORS.nodeNotConnected
  }

  output = typeof destination === "number" ? destination : output

  if (output < 0 || output >= source.numberOfOutputs) {
    return AUDIO_GRAPH_VALIDATION_ERRORS.outputOutsideRange
  }

  if (input < 0 || input >= source.numberOfInputs) {
    return AUDIO_GRAPH_VALIDATION_ERRORS.inputOutsideRange
  }
}

export const disconnectGraphNode = wrapValidation(
  validateDisconnectGraphNode,
  (options: DisconnectGraphNodeOptions) => {
    const sourceNode = getGraphNode(options.source)
    const destinationNodes = getDestinationNodesToDisconnect(
      sourceNode,
      options.destination
    )

    for (const destinationNode of destinationNodes) {
      removeNode(sourceNode.outputs, options.output, destinationNode)
      removeNode(destinationNode.inputs, options.input, sourceNode)
    }
  }
)

export const getGraphNode = (node: AudioNode | AudioParam): GraphNode => {
  const graphNode = GRAPH_NODE_MAP.get(node)

  if (!graphNode) {
    // mock audio nodes/params should always be registered upon instantiation
    throw new Error("Node was not registered")
  }

  return graphNode
}

export const getIsInCompleteGraph = (node: AudioNode | AudioParam): boolean => {
  const graphNode = getGraphNode(node)
  if (graphNode.isRoot) return true

  return Object.values(graphNode.outputs).some((nodes) =>
    nodes.some(({ value }) => getIsInCompleteGraph(value))
  )
}
