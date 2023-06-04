describe("Test mock audio nodes", () => {
  test("Constructors as expected", () => {
    expect(() => new AudioNode()).toThrow(new TypeError("Illegal constructor"))
    expect(() => new AudioBufferSourceNode(new AudioContext())).not.toThrow()
    expect(() => new AudioDestinationNode()).not.toThrow()
    expect(() => new AudioScheduledSourceNode()).not.toThrow()
    expect(() => new BiquadFilterNode(new AudioContext())).not.toThrow()
    expect(() => new ChannelMergerNode(new AudioContext())).not.toThrow()
    expect(() => new ChannelSplitterNode(new AudioContext())).not.toThrow()
    expect(() => new ConstantSourceNode(new AudioContext())).not.toThrow()
    expect(() => new ConvolverNode(new AudioContext())).not.toThrow()
    expect(() => new DelayNode(new AudioContext())).not.toThrow()
    expect(() => new DynamicsCompressorNode(new AudioContext())).not.toThrow()
    expect(() => new GainNode(new AudioContext())).not.toThrow()
    expect(
      () =>
        new IIRFilterNode(new AudioContext(), {
          feedback: [1],
          feedforward: [1],
        })
    ).not.toThrow()
    expect(
      () =>
        new MediaElementAudioSourceNode(new AudioContext(), {
          mediaElement: document.createElement("video"),
        })
    ).not.toThrow()
    expect(
      () => new MediaStreamAudioDestinationNode(new AudioContext())
    ).not.toThrow()
    expect(
      () =>
        new MediaStreamAudioSourceNode(new AudioContext(), {
          mediaStream: new MediaStream(),
        })
    ).not.toThrow()
    expect(() => new OscillatorNode(new AudioContext())).not.toThrow()
    expect(() => new PannerNode(new AudioContext())).not.toThrow()
  })
})
