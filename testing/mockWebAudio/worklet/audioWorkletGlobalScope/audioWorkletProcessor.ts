import { MessagePort } from "./messagePort"

export class AudioWorkletProcessor {
  process() {
    return true
  }

  port: MessagePort = new MessagePort()
}
