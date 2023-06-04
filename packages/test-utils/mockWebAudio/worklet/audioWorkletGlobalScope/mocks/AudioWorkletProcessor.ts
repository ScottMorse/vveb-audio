import { MessagePort } from "./MessagePort"

export class AudioWorkletProcessor {
  port: MessagePort = new MessagePort()

  process() {
    return true
  }
}
