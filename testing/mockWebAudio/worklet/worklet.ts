import { setGlobalProperty } from "../../util/globals"

export class Worklet {
  addModule(_url: string): Promise<void> {
    return Promise.resolve()
  }
}

export class AudioWorklet extends Worklet {}

export class AudioWorkletProcessor {
  constructor(options: ) {
    setInterval(() => {
      this.port.postMessage(this.port)
    }, 10)
  }

  process() {
    return true
  }

  port = new MessagePort()
}

export const mockWorklet = () => {
  setGlobalProperty("Worklet", Worklet)
  setGlobalProperty("AudioWorklet", AudioWorklet)
}

