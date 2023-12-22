import { MockEnvironment } from "@@test-utils/mockWebAudio/api/mockFactory"
import { createMockAudioParam } from "@@test-utils/mockWebAudio/api/mocks/audioParam"
import { OmitEventTarget } from "@@test-utils/mockWebAudio/util/types"
import { MockAudioScheduledSourceNodeInternals } from "../../scheduledSource/MockAudioScheduledSourceNodeInternals"

export class MockConstantSourceNodeInternals
  extends MockAudioScheduledSourceNodeInternals
  implements OmitEventTarget<ConstantSourceNode>
{
  constructor(
    mock: ConstantSourceNode,
    mockEnvironment: MockEnvironment,
    context: BaseAudioContext,
    options?: ConstantSourceOptions
  ) {
    super(mock, mockEnvironment, context)

    if (options?.offset !== undefined) {
      this._offset = createMockAudioParam(
        this.mockEnvironment.api,
        this.context,
        this.mock,
        {
          value: options.offset,
          defaultValue: 1,
          name: "ConstantSource.offset",
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
    this.mockEnvironment.api,
    this.context,
    this.mock,
    {
      defaultValue: 1,
      minValue: -3.4028234663852886e38,
      maxValue: 3.4028234663852886e38,
      name: "ConstantSource.offset",
    }
  )

  protected _channelCount = 2
}
