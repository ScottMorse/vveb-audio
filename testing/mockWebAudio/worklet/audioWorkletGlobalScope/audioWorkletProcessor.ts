import { MessagePort } from "./messagePort"

export class AudioWorkletProcessor {
  process() {
    return false
  }

  port: MessagePort = new MessagePort()
}
