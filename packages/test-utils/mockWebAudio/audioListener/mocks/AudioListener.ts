import { ConstructorNameToString } from "../../../internal/util/decorators"
import {
  NativeAudioListener,
  NativeBaseAudioContext,
} from "../../../internal/util/nativeTypes"
import { BaseAudioContext } from "../../audioContext"
import { createMockAudioParam } from "../../audioParam"

const ALLOW_CONSTRUCTOR = Symbol("ALLOW_CONSTRUCTOR")

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

@ConstructorNameToString
export class AudioListener implements NativeAudioListener {
  constructor(
    protected readonly context: NativeBaseAudioContext,
    _allow?: typeof ALLOW_CONSTRUCTOR
  ) {
    if (_allow !== ALLOW_CONSTRUCTOR) {
      throw new TypeError("Illegal constructor")
    }
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
    if (arguments.length < 6) {
      throw new TypeError(
        `Failed to execute 'setOrientation' on 'AudioListener': 6 arguments required, but only ${arguments.length} present.`
      )
    }

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
    if (arguments.length < 3) {
      throw new TypeError(
        `Failed to execute 'setPosition' on 'AudioListener': 3 arguments required, but only ${arguments.length} present.`
      )
    }

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

  protected _forwardX = createMockAudioParam(this.context, AUDIO_PARAM_OPTIONS)

  protected _forwardY = createMockAudioParam(this.context, AUDIO_PARAM_OPTIONS)

  protected _forwardZ = createMockAudioParam(this.context, {
    defaultValue: -1,
    ...AUDIO_PARAM_OPTIONS,
  })

  protected _positionX = createMockAudioParam(this.context, AUDIO_PARAM_OPTIONS)

  protected _positionY = createMockAudioParam(this.context, AUDIO_PARAM_OPTIONS)

  protected _positionZ = createMockAudioParam(this.context, AUDIO_PARAM_OPTIONS)

  protected _upX = createMockAudioParam(this.context, AUDIO_PARAM_OPTIONS)

  protected _upY = createMockAudioParam(this.context, {
    defaultValue: 1,
    ...AUDIO_PARAM_OPTIONS,
  })

  protected _upZ = createMockAudioParam(this.context, AUDIO_PARAM_OPTIONS)
}

export const createGlobalAudioListener = (context: BaseAudioContext) =>
  new AudioListener(
    context as unknown as NativeBaseAudioContext,
    ALLOW_CONSTRUCTOR
  )
