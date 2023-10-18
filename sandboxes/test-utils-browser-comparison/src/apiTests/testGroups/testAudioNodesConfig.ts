import type {
  CreatableAudioNodeName,
  AudioNodeContextMethodName,
  AudioNodeOptions,
  AudioNodeInstance,
} from "@@core/webAudio/types"

type AudioNodeNameWithContextMethod = {
  [Name in CreatableAudioNodeName]: AudioNodeContextMethodName<Name> extends null
    ? never
    : Name
}[CreatableAudioNodeName]

const createAudioMediaStream = () =>
  new AudioContext().createMediaStreamDestination().stream

export const createAudioNodesTestConfig = (): {
  [Name in AudioNodeNameWithContextMethod]?: {
    contextMethodArgs: Parameters<
      AudioContext[AudioNodeContextMethodName<Name>]
    >
    optionsArg: AudioNodeOptions<Name>
    comparisonProperties: (keyof AudioNodeInstance<Name>)[]
  }
} => {
  const stream = createAudioMediaStream()
  return {
    analyser: {
      contextMethodArgs: [],
      optionsArg: {
        fftSize: 2048,
        maxDecibels: -30,
        minDecibels: -100,
        smoothingTimeConstant: 0.8,
      },
      comparisonProperties: [
        "fftSize",
        "maxDecibels",
        "minDecibels",
        "smoothingTimeConstant",
      ],
    },
    bufferSource: {
      contextMethodArgs: [],
      optionsArg: {
        buffer: null,
        loop: true,
        loopStart: 0.5,
        loopEnd: 1,
        playbackRate: 1,
      },
      comparisonProperties: [
        "buffer",
        "loop",
        "loopStart",
        "loopEnd",
        "playbackRate",
      ],
    },
    biquadFilter: {
      contextMethodArgs: [],
      optionsArg: {
        Q: 1,
        detune: 0,
        frequency: 350,
        gain: 0,
        type: "lowpass",
      },
      comparisonProperties: ["Q", "detune", "frequency", "gain", "type"],
    },
    channelMerger: {
      contextMethodArgs: [],
      optionsArg: {},
      comparisonProperties: [],
    },
    channelSplitter: {
      contextMethodArgs: [],
      optionsArg: {},
      comparisonProperties: [],
    },
    constantSource: {
      contextMethodArgs: [],
      optionsArg: {
        offset: 1,
      },
      comparisonProperties: ["offset"],
    },
    convolver: {
      contextMethodArgs: [],
      optionsArg: {
        buffer: new AudioBuffer({
          length: 1,
          sampleRate: 44100,
          numberOfChannels: 1,
        }),
      },
      comparisonProperties: ["buffer"],
    },
    delay: {
      contextMethodArgs: [],
      optionsArg: {
        delayTime: 123,
      },
      comparisonProperties: ["delayTime"],
    },
    dynamicsCompressor: {
      contextMethodArgs: [],
      optionsArg: {
        attack: 0.005,
        knee: 20,
        ratio: 10,
        release: 0.35,
        threshold: -12,
      },
      comparisonProperties: ["attack", "knee", "ratio", "release", "threshold"],
    },
    gain: {
      contextMethodArgs: [],
      optionsArg: {
        gain: 0.5,
      },
      comparisonProperties: ["gain"],
    },
    iirFilter: {
      contextMethodArgs: [
        [1, 2, 3],
        [4, 5, 6],
      ],
      optionsArg: {
        feedforward: [1, 2, 3],
        feedback: [4, 5, 6],
      },
      comparisonProperties: [],
    },
    mediaElementSource: {
      contextMethodArgs: [document.createElement("video")],
      optionsArg: {
        mediaElement: document.createElement("video"),
      },
      comparisonProperties: [],
    },
    mediaStreamDestination: {
      contextMethodArgs: [],
      optionsArg: {},
      comparisonProperties: [],
    },
    mediaStreamSource: {
      contextMethodArgs: [stream],
      optionsArg: {
        mediaStream: stream,
      },
      comparisonProperties: [],
    },
    oscillator: {
      contextMethodArgs: [],
      optionsArg: {
        frequency: 256,
        detune: 2,
        type: "sawtooth",
      },
      comparisonProperties: ["frequency", "detune", "type"],
    },
    panner: {
      contextMethodArgs: [],
      optionsArg: {
        coneInnerAngle: 270,
        coneOuterAngle: 90,
        coneOuterGain: 0.5,
        distanceModel: "exponential",
        maxDistance: 5000,
        orientationX: 0,
        orientationY: 2,
        orientationZ: 1,
        panningModel: "HRTF",
        positionX: 3,
        positionY: 2,
        positionZ: 5,
        refDistance: 2,
        rolloffFactor: 2,
      },
      comparisonProperties: [
        "coneInnerAngle",
        "coneOuterAngle",
        "coneOuterGain",
        "distanceModel",
        "maxDistance",
        "orientationX",
        "orientationY",
        "orientationZ",
        "panningModel",
        "positionX",
        "positionY",
        "positionZ",
        "refDistance",
        "rolloffFactor",
      ],
    },
    stereoPanner: {
      contextMethodArgs: [],
      optionsArg: {
        pan: 0.5,
      },
      comparisonProperties: ["pan"],
    },
  }
}
