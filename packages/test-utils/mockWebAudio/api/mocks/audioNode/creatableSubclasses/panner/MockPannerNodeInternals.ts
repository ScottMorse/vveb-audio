import { createMockAudioParam } from "@@test-utils/mockWebAudio/api/mocks/audioParam"
import { OmitEventTarget } from "@@test-utils/mockWebAudio/util/types"
import { MockAudioNodeInternals } from "../../base/MockAudioNodeInternals"

export class MockPannerNodeInternals
  extends MockAudioNodeInternals
  implements OmitEventTarget<PannerNode>
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
    this.mockEnvironment.api,
    this.context,
    this.mock,
    this,
    {
      defaultValue: 1,
      minValue: -3.4028234663852886e38,
      maxValue: 3.4028234663852886e38,
      name: "Panner.orientationX",
    }
  )

  protected _orientationY = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    this,
    {
      minValue: -3.4028234663852886e38,
      maxValue: 3.4028234663852886e38,
      name: "Panner.orientationY",
    }
  )

  protected _orientationZ = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    this,
    {
      minValue: -3.4028234663852886e38,
      maxValue: 3.4028234663852886e38,
      name: "Panner.orientationZ",
    }
  )

  protected _panningModel: PanningModelType = "equalpower"

  protected _positionX = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    this,
    {
      minValue: -3.4028234663852886e38,
      maxValue: 3.4028234663852886e38,
      name: "Panner.positionX",
    }
  )

  protected _positionY = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    this,
    {
      minValue: -3.4028234663852886e38,
      maxValue: 3.4028234663852886e38,
      name: "Panner.positionY",
    }
  )

  protected _positionZ = createMockAudioParam(
    this.mockEnvironment.api,
    this.context,
    this.mock,
    this,
    {
      minValue: -3.4028234663852886e38,
      maxValue: 3.4028234663852886e38,
      name: "Panner.positionZ",
    }
  )

  protected _refDistance = 1

  protected _rolloffFactor = 1

  protected _channelCountMode = "clamped-max" as const

  protected _channelCount = 2
}
