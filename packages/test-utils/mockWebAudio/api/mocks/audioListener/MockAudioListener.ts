import { EngineContext } from "@@test-utils/mockWebAudio/engine/engineContext"
import { BaseMock, getInternals } from "../../baseMock"
import { MockAudioListenerInternals } from "./MockAudioListenerInternals"

const ALLOW_CONSTRUCTOR = Symbol("ALLOW_CONSTRUCTOR")

export class MockAudioListener
  extends BaseMock<MockAudioListenerInternals>
  implements AudioListener
{
  constructor(context: BaseAudioContext, _allow: typeof ALLOW_CONSTRUCTOR) {
    super(new MockAudioListenerInternals(context))
    if (_allow !== ALLOW_CONSTRUCTOR) {
      throw new TypeError("Illegal constructor")
    }
  }

  get forwardX() {
    return getInternals(this).forwardX
  }

  get forwardY() {
    return getInternals(this).forwardY
  }

  get forwardZ() {
    return getInternals(this).forwardZ
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

  setOrientation(
    forwardX: number,
    forwardY: number,
    forwardZ: number,
    upX: number,
    upY: number,
    upZ: number
  ): void {
    getInternals(this).setOrientation(
      forwardX,
      forwardY,
      forwardZ,
      upX,
      upY,
      upZ
    )
  }

  setPosition(x: number, y: number, z: number): void {
    getInternals(this).setPosition(x, y, z)
  }

  get upX() {
    return getInternals(this).upX
  }

  get upY() {
    return getInternals(this).upY
  }

  get upZ() {
    return getInternals(this).upZ
  }
}

export const createMockAudioListener = (
  engineContext: EngineContext,
  context: BaseAudioContext
) =>
  new (engineContext.mockApi
    .AudioListener)(
    context,
    ALLOW_CONSTRUCTOR
  )
