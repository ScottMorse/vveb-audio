import { createMockFactory } from "@@test-utils/mockWebAudio/api/mockFactory"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { MockAudioNodeArgs } from "../../base"
import { MockPannerNodeInternals } from "./MockPannerNodeInternals"

export const createPannerNodeMock = createMockFactory<
  typeof PannerNode,
  MockPannerNodeInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @MockConstructorName("PannerNode")
  class MockPannerNode
    extends mockEnvironment.api.AudioNode
    implements PannerNode
  {
    constructor(context: BaseAudioContext, options?: PannerOptions) {
      const args: MockAudioNodeArgs = [context, options]
      super(...(args as unknown as []))
      setInternals(
        this,
        new MockPannerNodeInternals(this, mockEnvironment, context)
      )
    }

    get coneInnerAngle(): number {
      return getInternals(this).coneInnerAngle
    }

    get coneOuterAngle(): number {
      return getInternals(this).coneOuterAngle
    }

    get coneOuterGain(): number {
      return getInternals(this).coneOuterGain
    }

    get distanceModel(): DistanceModelType {
      return getInternals(this).distanceModel
    }

    get maxDistance(): number {
      return getInternals(this).maxDistance
    }

    get orientationX(): AudioParam {
      return getInternals(this).orientationX
    }

    get orientationY(): AudioParam {
      return getInternals(this).orientationY
    }

    get orientationZ(): AudioParam {
      return getInternals(this).orientationZ
    }

    get panningModel(): PanningModelType {
      return getInternals(this).panningModel
    }

    get positionX(): AudioParam {
      return getInternals(this).positionX
    }

    get positionY(): AudioParam {
      return getInternals(this).positionY
    }

    get positionZ(): AudioParam {
      return getInternals(this).positionZ
    }

    get refDistance(): number {
      return getInternals(this).refDistance
    }

    get rolloffFactor(): number {
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

  return MockPannerNode
})
