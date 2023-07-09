import { MockAudioNodeInternals } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNodeInternals"
import { createMockAudioParam } from "@@test-utils/mockWebAudio/api/mocks/audioParam"
import { getEngineContext } from "@@test-utils/mockWebAudio/engine/engineContext"

export class MockPannerNodeInternals
  extends MockAudioNodeInternals
  implements PannerNode
{
  get channelCount() {
    return this._channelCount
  }

  get channelCountMode() {
    return this._channelCountMode
  }

  get coneInnerAngle() {
    return this._coneInnerAngle
  }

  get coneOuterAngle() {
    return this._coneOuterAngle
  }

  get coneOuterGain() {
    return this._coneOuterGain
  }

  get distanceModel() {
    return this._distanceModel
  }

  get maxDistance() {
    return this._maxDistance
  }

  get orientationX() {
    return this._orientationX
  }

  get orientationY() {
    return this._orientationY
  }

  get orientationZ() {
    return this._orientationZ
  }

  get panningModel() {
    return this._panningModel
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

  get refDistance() {
    return this._refDistance
  }

  get rolloffFactor() {
    return this._rolloffFactor
  }

  setOrientation(_x: number, _y: number, _z: number): void {}

  setPosition(_x: number, _y: number, _z: number): void {}

  setVelocity(_x: number, _y: number, _z: number): void {}

  protected _coneInnerAngle = 360

  protected _coneOuterAngle = 360

  protected _coneOuterGain = 0

  protected _distanceModel: DistanceModelType = "inverse"

  protected _maxDistance = 10000

  protected _orientationX = createMockAudioParam(
    getEngineContext(this),
    this.context,
    {
      defaultValue: 1,
      minValue: -3.4028234663852886e38,
      maxValue: 3.4028234663852886e38,
    }
  )

  protected _orientationY = createMockAudioParam(
    getEngineContext(this),
    this.context,
    {
      minValue: -3.4028234663852886e38,
      maxValue: 3.4028234663852886e38,
    }
  )

  protected _orientationZ = createMockAudioParam(
    getEngineContext(this),
    this.context,
    {
      minValue: -3.4028234663852886e38,
      maxValue: 3.4028234663852886e38,
    }
  )

  protected _panningModel: PanningModelType = "equalpower"

  protected _positionX = createMockAudioParam(
    getEngineContext(this),
    this.context,
    {
      minValue: -3.4028234663852886e38,
      maxValue: 3.4028234663852886e38,
    }
  )

  protected _positionY = createMockAudioParam(
    getEngineContext(this),
    this.context,
    {
      minValue: -3.4028234663852886e38,
      maxValue: 3.4028234663852886e38,
    }
  )

  protected _positionZ = createMockAudioParam(
    getEngineContext(this),
    this.context,
    {
      minValue: -3.4028234663852886e38,
      maxValue: 3.4028234663852886e38,
    }
  )

  protected _refDistance = 1

  protected _rolloffFactor = 1

  protected _channelCountMode = "clamped-max" as const

  protected _channelCount = 2
}
