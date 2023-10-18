import { MockEnvironment, MockInternals } from "../../mockFactory"
import { createMockAudioParam } from "../audioParam/MockAudioParam"

const validatePoint = (value: number, method: string) => {
  value = Number(value)
  if (typeof value !== "number" || !isFinite(value)) {
    throw new TypeError(
      `Failed to execute '${method}' on 'AudioListener': The provided float value is non-finite.`
    )
  }
  return value
}

const AUDIO_PARAM_OPTIONS = {
  minValue: -3.4028234663852886e38,
  maxValue: 3.4028234663852886e38,
}

export class MockAudioListenerInternals
  extends MockInternals<AudioListener>
  implements AudioListener
{
  constructor(
    mock: AudioListener,
    mockEnvironment: MockEnvironment,
    protected readonly context: BaseAudioContext
  ) {
    super(mock, mockEnvironment)
  }

  get forwardX() {
    return this._forwardX
  }

  get forwardY() {
    return this._forwardY
  }

  get forwardZ() {
    return this._forwardZ
  }

  get positionX() {
    return this._positionX
  }

  get positionY() {
    return this._positionY
  }

  get positionZ() {
    return this._positionZ
  }

  /** @deprecated Included due to presence in common browsers */
  setOrientation(
    forwardX: number,
    forwardY: number,
    forwardZ: number,
    upX: number,
    upY: number,
    upZ: number
  ): void {
    forwardX = validatePoint(forwardX, "setOrientation")
    forwardY = validatePoint(forwardY, "setOrientation")
    forwardZ = validatePoint(forwardZ, "setOrientation")
    upX = validatePoint(upX, "setOrientation")
    upY = validatePoint(upY, "setOrientation")
    upZ = validatePoint(upZ, "setOrientation")

    this._forwardX.value = forwardX
    this._forwardY.value = forwardY
    this._forwardZ.value = forwardZ
    this._upX.value = upX
    this._upY.value = upY
    this._upZ.value = upZ
  }

  /** @deprecated Included due to presence in common browsers */
  setPosition(x: number, y: number, z: number): void {
    x = validatePoint(x, "setPosition")
    y = validatePoint(y, "setPosition")
    z = validatePoint(z, "setPosition")

    this._positionX.value = x
    this._positionY.value = y
    this._positionZ.value = z
  }

  get upX() {
    return this._upX
  }

  get upY() {
    return this._upY
  }

  get upZ() {
    return this._upZ
  }

  protected _forwardX = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    AUDIO_PARAM_OPTIONS
  )

  protected _forwardY = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    AUDIO_PARAM_OPTIONS
  )

  protected _forwardZ = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    {
      defaultValue: -1,
      ...AUDIO_PARAM_OPTIONS,
    }
  )

  protected _positionX = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    AUDIO_PARAM_OPTIONS
  )

  protected _positionY = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    AUDIO_PARAM_OPTIONS
  )

  protected _positionZ = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    AUDIO_PARAM_OPTIONS
  )

  protected _upX = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    AUDIO_PARAM_OPTIONS
  )

  protected _upY = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    {
      defaultValue: 1,
      ...AUDIO_PARAM_OPTIONS,
    }
  )

  protected _upZ = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    AUDIO_PARAM_OPTIONS
  )
}
