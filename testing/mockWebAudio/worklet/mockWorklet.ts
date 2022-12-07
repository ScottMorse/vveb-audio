import { setGlobalProperty } from "../../util/globals"

export class Worklet {
  addModule(_url: string): Promise<void> {
    return Promise.resolve()
  }
}

export class AudioWorklet extends Worklet {}

export const mockWorklet = () => {
  setGlobalProperty("Worklet", Worklet)
  setGlobalProperty("AudioWorklet", AudioWorklet)
}
