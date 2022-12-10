/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */

export class AudioNode {
  constructor(public context: BaseAudioContext, options?: any) {
    for (const [key, value] of Object.entries(options)) {
      // this[key] = value /** @todo review */
    }
  }

  /** @todo review defaults and set/get usage */
  numberOfInputs = 1
  numberOfOutputs = 1
  channelCount = 1
  channelCountMode = "max"
  channelInterpretation = "speakers"

  connect() {}
  disconnect() {}
}
