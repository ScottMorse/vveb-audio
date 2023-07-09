import { createMockAudioParam } from "@@test-utils/mockWebAudio/api/mocks/audioParam"
import { getEngineContext } from "@@test-utils/mockWebAudio/engine/engineContext"
import { MockAudioScheduledSourceNodeInternals } from "../../scheduledSource/MockAudioScheduledSourceNodeInternals"

export class MockConstantSourceNodeInternals
  extends MockAudioScheduledSourceNodeInternals
  implements ConstantSourceNode
{
  constructor(context: BaseAudioContext, options?: ConstantSourceOptions) {
    super(context)
    if (options?.offset !== undefined) {
      this._offset = createMockAudioParam(
        getEngineContext(this),
        this.context,
        {
          value: options.offset,
          defaultValue: 1,
        }
      )
    }
  }

  get channelCount() {
    return this._channelCount
  }

  get numberOfInputs() {
    return 0
  }

  get offset() {
    return this._offset
  }

  protected _offset = createMockAudioParam(
    getEngineContext(this),
    this.context,
    {
      defaultValue: 1,
      minValue: -3.4028234663852886e38,
      maxValue: 3.4028234663852886e38,
    }
  )

  protected _channelCount = 2
}
