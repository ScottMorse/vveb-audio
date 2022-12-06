/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */

export class AudioNode {
  constructor(public context: BaseAudioContext, options?: any) {
    for (const [key, value] of Object.entries(options)) {
      this[key] = value
    }
  }

  public numberOfInputs = 1
  public numberOfOutputs = 1
  public channelCount = 1
  public channelCountMode = "max"
  public channelInterpretation = "speakers"

  public connect() {}
  public disconnect() {}
}
