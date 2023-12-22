import { createMockAudioListener } from "@@test-utils/mockWebAudio/api/mocks/audioListener"
import {
  compareInstance,
  compareThrow,
  createCommonNumberTestArgs,
  createMissingArgs,
  createVariedTypeArgs,
} from "src/lib/testUtils"
import { TestGroupConfig } from "../testGroupConfig"

export const AUDIO_LISTENER_TEST_GROUP: TestGroupConfig = {
  name: "AudioListener",
  tests: {
    compareClass: {
      name: "Compare Class",
      run: ({ mockWebAudio }) => {
        compareThrow({
          real: () => new AudioListener(),
          mock: () => new mockWebAudio.api.AudioListener(),
          name: "Constructor",
        })

        const real = new AudioContext().listener
        const mock = createMockAudioListener(
          mockWebAudio.api,
          new mockWebAudio.api.AudioContext()
        )

        const stringifyAudioParam = (param: AudioParam) =>
          `type: ${param?.constructor.name}, value: ${param.value}, defaultValue: ${param.defaultValue}, min: ${param.minValue}, max: ${param.maxValue}`

        return compareInstance({
          name: "Mock AudioListener",
          real,
          mock,
          props: {
            forwardX: stringifyAudioParam,
            forwardY: stringifyAudioParam,
            forwardZ: stringifyAudioParam,
            positionX: stringifyAudioParam,
            positionY: stringifyAudioParam,
            positionZ: stringifyAudioParam,
            upX: stringifyAudioParam,
            upY: stringifyAudioParam,
            upZ: stringifyAudioParam,
          },
          methods: {
            setOrientation: [
              {
                args: [1, 2, 3, 4, 5, 6],
                name: "1,2,3,4,5,6",
              },
              ...createCommonNumberTestArgs<{
                args: Parameters<AudioListener["setOrientation"]>
                name: string
              }>((x) => ({
                args: [x, 2, 3, 4, 5, 6],
                name: `${x},2,3,4,5,6`,
              })),
              ...createCommonNumberTestArgs<{
                args: Parameters<AudioListener["setOrientation"]>
                name: string
              }>((x) => ({
                args: [1, x, 3, 4, 5, 6],
                name: `1,${x},3,4,5,6`,
              })),
              ...createCommonNumberTestArgs<{
                args: Parameters<AudioListener["setOrientation"]>
                name: string
              }>((x) => ({
                args: [1, 2, x, 4, 5, 6],
                name: `1,2,${x},4,5,6`,
              })),
              ...createCommonNumberTestArgs<{
                args: Parameters<AudioListener["setOrientation"]>
                name: string
              }>((x) => ({
                args: [1, 2, 3, x, 5, 6],
                name: `1,2,3,${x},5,6`,
              })),
              ...createCommonNumberTestArgs<{
                args: Parameters<AudioListener["setOrientation"]>
                name: string
              }>((x) => ({
                args: [1, 2, 3, 4, x, 6],
                name: `1,2,3,4,${x},6`,
              })),
              ...createCommonNumberTestArgs<{
                args: Parameters<AudioListener["setOrientation"]>
                name: string
              }>((x) => ({
                args: [1, 2, 3, 4, 5, x],
                name: `1,2,3,4,5,${x}`,
              })),
            ],
            setPosition: [
              {
                args: [1, 2, 3],
                name: "1,2,3",
              },
              // with all args
              ...createCommonNumberTestArgs<{
                args: Parameters<AudioListener["setPosition"]>
                name: string
              }>((x) => ({
                args: [x, x, x],
                name: `(Gen) ${x},${x},${x}`,
              })),
              ...createCommonNumberTestArgs<{
                args: Parameters<AudioListener["setPosition"]>
                name: string
              }>((x) => ({
                args: [x, 2, 3],
                name: `(Gen) ${x},2,3`,
              })),
              ...createCommonNumberTestArgs<{
                args: Parameters<AudioListener["setPosition"]>
                name: string
              }>((x) => ({
                args: [1, x, 3],
                name: `(Gen) 1,${x},3`,
              })),
              ...createCommonNumberTestArgs<{
                args: Parameters<AudioListener["setPosition"]>
                name: string
              }>((x) => ({
                args: [1, 2, x],
                name: `(Gen) 1,2,${x}`,
              })),
            ],
          },
          errorMethods: {
            setOrientation: [
              ...createVariedTypeArgs(
                (args) => ({
                  args,
                  name: `(Gen) setOrientation(${args.join(",")})`,
                }),
                [1, 2, 3, 4, 5, 6]
              ),
              ...createMissingArgs(
                (args) => ({
                  args,
                  name: `(Gen) setOrientation(${args.join(",")})`,
                }),
                [1, 2, 3, 4, 5, 6]
              ),
            ],
            setPosition: [
              ...createVariedTypeArgs(
                (args) => ({
                  args,
                  name: `(Gen) setPosition(${args.join(",")})`,
                }),
                [1, 2, 3]
              ),
              ...createMissingArgs(
                (args) => ({
                  args,
                  name: `(Gen) setPosition(${args.join(",")})`,
                }),
                [1, 2, 3]
              ),
            ],
          },
        })
      },
    },
  },
}
