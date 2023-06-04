import {
  removeGlobalProperty,
  setGlobalProperty,
} from "../../internal/util/globals"
import { PeriodicWave } from "./mocks"

export const mockGlobalPeriodicWave = () => {
  setGlobalProperty("PeriodicWave", PeriodicWave)
}

export const unMockGlobalPeriodicWave = () => {
  removeGlobalProperty("PeriodicWave")
}
