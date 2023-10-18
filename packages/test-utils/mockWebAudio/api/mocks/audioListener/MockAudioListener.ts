import { ValidateMethodArgsLength } from "@@test-utils/mockWebAudio/util/arguments"
import { MockConstructorName } from "@@test-utils/mockWebAudio/util/constructorName"
import { createMockFactory, MockWebAudioApi } from "../../mockFactory"
import { MockAudioListenerInternals } from "./MockAudioListenerInternals"

const ALLOW_CONSTRUCTOR = Symbol("ALLOW_CONSTRUCTOR")

export const createAudioListenerMock = createMockFactory<
  typeof AudioListener,
  MockAudioListenerInternals
>(({ setInternals, getInternals, mockEnvironment }) => {
  @MockConstructorName("AudioListener")
  class MockAudioListener implements AudioListener {
    constructor(context: BaseAudioContext, allow?: typeof ALLOW_CONSTRUCTOR) {
      if (allow !== ALLOW_CONSTRUCTOR) {
        throw new TypeError("Illegal constructor")
      }

      setInternals(
        this,
        new MockAudioListenerInternals(this, mockEnvironment, context)
      )
    }

    get forwardX(): AudioParam {
      return getInternals(this).forwardX
    }

    get forwardY(): AudioParam {
      return getInternals(this).forwardY
    }

    get forwardZ(): AudioParam {
      return getInternals(this).forwardZ
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

    @ValidateMethodArgsLength(6)
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

    @ValidateMethodArgsLength(3)
    setPosition(x: number, y: number, z: number): void {
      getInternals(this).setPosition(x, y, z)
    }

    get upX(): AudioParam {
      return getInternals(this).upX
    }

    get upY(): AudioParam {
      return getInternals(this).upY
    }

    get upZ(): AudioParam {
      return getInternals(this).upZ
    }
  }

  return MockAudioListener as typeof AudioListener
})

export const createMockAudioListener = (
  api: MockWebAudioApi,
  context: BaseAudioContext
) => new api.AudioListener(...([context, ALLOW_CONSTRUCTOR] as unknown as []))
