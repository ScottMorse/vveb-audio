import { getInternals } from "@@test-utils/mockWebAudio/api/baseMock"
import { MockAudioNode } from "@@test-utils/mockWebAudio/api/mocks/audioNode/base/MockAudioNode"
import { MockPannerNodeInternals } from "./MockPannerNodeInternals"

export class MockPannerNode
  extends MockAudioNode<MockPannerNodeInternals>
  implements PannerNode
{
  constructor(context: BaseAudioContext, options?: PannerOptions) {
    super(context, options, new MockPannerNodeInternals(context, options))
  }

  get coneInnerAngle() {
    return getInternals(this).coneInnerAngle
  }

  get coneOuterAngle() {
    return getInternals(this).coneOuterAngle
  }

  get coneOuterGain() {
    return getInternals(this).coneOuterGain
  }

  get distanceModel() {
    return getInternals(this).distanceModel
  }

  get maxDistance() {
    return getInternals(this).maxDistance
  }

  get orientationX() {
    return getInternals(this).orientationX
  }

  get orientationY() {
    return getInternals(this).orientationY
  }

  get orientationZ() {
    return getInternals(this).orientationZ
  }

  get panningModel() {
    return getInternals(this).panningModel
  }

  get positionX() {
    return getInternals(this).positionX
  }

  get positionY() {
    return getInternals(this).positionY
  }

  get positionZ() {
    return getInternals(this).positionZ
  }

  get refDistance() {
    return getInternals(this).refDistance
  }

  get rolloffFactor() {
    return getInternals(this).rolloffFactor
  }

  setOrientation(x: number, y: number, z: number) {
    return getInternals(this).setOrientation(x, y, z)
  }

  setPosition(x: number, y: number, z: number) {
    return getInternals(this).setPosition(x, y, z)
  }

  setVelocity(x: number, y: number, z: number) {
    return getInternals(this).setVelocity(x, y, z)
  }
}
