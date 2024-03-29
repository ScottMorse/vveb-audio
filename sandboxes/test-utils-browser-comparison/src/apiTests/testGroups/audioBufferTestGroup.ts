import {
  compareClass,
  createCommonNumberTestArgs,
  createMissingArgs,
  createVariedTypeArgs,
} from "src/lib/testUtils"
import { TestGroupConfig } from "../testGroupConfig"

export const AUDIO_BUFFER_TEST_GROUP: TestGroupConfig = {
  name: "AudioBuffer",
  tests: {
    compareClass: {
      name: "Compare Class",
      run: ({ mockWebAudio, deviceSettings }) => {
        const stringifyGetChannelDataResult = (result: Float32Array) =>
          result?.constructor.name

        return compareClass({
          name: "Mock AudioBuffer",
          real: AudioBuffer,
          mock: mockWebAudio.api.AudioBuffer,
          constructorArgLists: [
            {
              args: [
                {
                  length: 10,
                  sampleRate: 44100,
                  numberOfChannels: 1,
                },
              ],
              name: "Studio sample rate, length 20, 2 channel",
            },
            {
              args: [
                {
                  length: 20,
                  sampleRate: 48000,
                  numberOfChannels: 2,
                },
              ],
              name: "Studio sample rate, length 20, 2 channel",
            },
            {
              args: [
                {
                  length: 20,
                  sampleRate: 48000,
                  numberOfChannels: 3,
                },
              ],
              name: "Studio sample rate, length 20, 3 channel",
            },
            {
              args: [
                {
                  length: 20,
                  sampleRate: 48000,
                  numberOfChannels: 5,
                },
              ],
              name: "Studio sample rate, length 20, 4 channel",
            },
            {
              args: [
                {
                  length: 20,
                  sampleRate: 44100,
                },
              ],
              name: "Studio sample rate, length 20, default channel",
            },
            {
              args: [
                {
                  length: 20,
                  sampleRate: deviceSettings.minSampleRate + 1,
                },
              ],
              name: "Min device sample rate, length 20, default channel (check Device Settings)",
            },
            {
              args: [
                {
                  length: 20,
                  sampleRate: deviceSettings.maxSampleRate - 1,
                },
              ],
              name: "Max device sample rate, length 20, default channel (check Device Settings)",
            },
            ...createCommonNumberTestArgs<{
              args: [AudioBufferOptions]
              name: string
            }>((length) => ({
              args: [
                {
                  length,
                  sampleRate: 44100,
                },
              ],
              name: `Length ${length}`,
            })),
            ...createCommonNumberTestArgs<{
              args: [AudioBufferOptions]
              name: string
            }>((sampleRate) => ({
              args: [
                {
                  length: 20,
                  sampleRate,
                },
              ],
              name: `(Gen) Sample rate ${sampleRate}`,
            })),
            ...createCommonNumberTestArgs<{
              args: [AudioBufferOptions]
              name: string
            }>((numberOfChannels) => ({
              args: [
                {
                  length: 20,
                  sampleRate: 44100,
                  numberOfChannels,
                },
              ],
              name: `(Gen) Number of channels ${numberOfChannels}`,
            })),
          ],
          errorConstructorArgLists: [
            {
              args: [
                {
                  length: 20,
                  sampleRate: deviceSettings.minSampleRate,
                },
              ],
              name: "Exact min sample rate",
            },
            {
              args: [
                {
                  length: 20,
                  sampleRate: deviceSettings.maxSampleRate,
                },
              ],
              name: "Exact max sample rate",
            },
            {
              args: [
                {
                  length: 20,
                  sampleRate: deviceSettings.minSampleRate - 100,
                },
              ],
              name: "Low min sample rate",
            },
            {
              args: [
                {
                  length: 20,
                  sampleRate: deviceSettings.maxSampleRate + 100,
                },
              ],
              name: "High max sample rate",
            },
            ...createVariedTypeArgs<
              {
                args: [AudioBufferOptions]
                name: string
              },
              [AudioBufferOptions]
            >(
              (args, value) => ({
                args: args as [AudioBufferOptions],
                name: `(Gen) Options arg: ${value}`,
              }),
              [
                {
                  length: 20,
                  sampleRate: 44100,
                  numberOfChannels: 2,
                },
              ]
            ),
            ...createVariedTypeArgs<
              {
                args: [AudioBufferOptions]
                name: string
              },
              [AudioBufferOptions]
            >(
              (_, value) => ({
                args: [
                  {
                    length: value as number,
                    sampleRate: 44100,
                    numberOfChannels: 2,
                  },
                ],
                name: `(Gen) Length: ${value}`,
              }),
              [
                {
                  length: 20,
                  sampleRate: 44100,
                  numberOfChannels: 2,
                },
              ]
            ),
            ...createVariedTypeArgs<
              {
                args: [AudioBufferOptions]
                name: string
              },
              [AudioBufferOptions]
            >(
              (_, value) => ({
                args: [
                  {
                    length: 20,
                    sampleRate: value as number,
                    numberOfChannels: 2,
                  },
                ],
                name: `(Gen) Sample rate: ${value}`,
              }),
              [
                {
                  length: 20,
                  sampleRate: 44100,
                  numberOfChannels: 2,
                },
              ]
            ),
            ...createVariedTypeArgs<
              {
                args: [AudioBufferOptions]
                name: string
              },
              [AudioBufferOptions]
            >(
              (_, value) => ({
                args: [
                  {
                    length: 20,
                    sampleRate: 44100,
                    numberOfChannels: value as number,
                  },
                ],
                name: `(Gen) Number of channels: ${value}`,
              }),
              [
                {
                  length: 20,
                  sampleRate: 44100,
                  numberOfChannels: 2,
                },
              ]
            ),
          ],
          props: {
            length: null,
            duration: null,
            numberOfChannels: null,
            sampleRate: null,
          },
          methods: {
            copyFromChannel: [
              {
                args: [new Float32Array(10), 0],
                name: "First channel",
              },
              {
                args: [new Float32Array(10), 1],
                name: "Second channel",
              },
              {
                args: [new Float32Array(10), 2],
                name: "Third channel",
              },
              {
                args: [new Float32Array(10), 3],
                name: "Fourth channel",
              },
              // with optional startInChannel third arg
              {
                args: [new Float32Array(10), 0, 0],
                name: "Channel 0, startInChannel 0",
              },
              {
                args: [new Float32Array(10), 0, 5],
                name: "Channel 0, startInChannel 5",
              },
              {
                args: [new Float32Array(10), 1, 0],
                name: "Channel 1, startInChannel 0",
              },
              {
                args: [new Float32Array(10), 1, 2],
                name: "Channel 1, startInChannel 2",
              },
              {
                args: [new Float32Array(10), 2, 0],
                name: "Channel 2, startInChannel 0",
              },
              {
                args: [new Float32Array(10), 2, 4],
                name: "Channel 2, startInChannel 3",
              },
              {
                args: [new Float32Array(10), 3, 2],
                name: "Channel 3, startInChannel 2",
              },
              {
                args: [new Float32Array(10), 3, 5],
                name: "Channel 3, startInChannel 5",
              },
              ...createCommonNumberTestArgs<{
                args: [Float32Array, number, number?]
                name: string
              }>((channelNumber) => ({
                args: [new Float32Array(10), channelNumber],
                name: `(Gen) Channel ${channelNumber}`,
              })),
              ...createCommonNumberTestArgs<{
                args: [Float32Array, number, number?]
                name: string
              }>((channelNumber) => ({
                args: [new Float32Array(10), channelNumber, 0],
                name: `(Gen) Channel ${channelNumber}, startInChannel 0`,
              })),
              ...createCommonNumberTestArgs<{
                args: [Float32Array, number, number?]
                name: string
              }>((channelNumber) => ({
                args: [new Float32Array(10), channelNumber, 1],
                name: `(Gen) Channel ${channelNumber}, startInChannel 1`,
              })),
              ...createCommonNumberTestArgs<{
                args: [Float32Array, number, number?]
                name: string
              }>((startInChannel) => ({
                args: [new Float32Array(10), 0, startInChannel],
                name: `(Gen) Channel ${0}, startInChannel ${startInChannel}`,
              })),
              ...createCommonNumberTestArgs<{
                args: [Float32Array, number, number?]
                name: string
              }>((combo) => ({
                args: [new Float32Array(10), combo, combo],
                name: `(Gen) Channel ${combo}, startInChannel ${combo}`,
              })),
            ],
            copyToChannel: [
              {
                args: [new Float32Array(10), 0],
                name: "First channel",
              },
              {
                args: [new Float32Array(10), 1],
                name: "Second channel",
              },
              {
                args: [new Float32Array(10), 2],
                name: "Third channel",
              },
              {
                args: [new Float32Array(10), 3],
                name: "Fourth channel",
              },
              // with optional startInChannel third arg
              {
                args: [new Float32Array(10), 0, 0],
                name: "Channel 0, startInChannel 0",
              },
              {
                args: [new Float32Array(10), 0, 5],
                name: "Channel 0, startInChannel 5",
              },
              {
                args: [new Float32Array(10), 1, 0],
                name: "Channel 1, startInChannel 0",
              },
              {
                args: [new Float32Array(10), 1, 2],
                name: "Channel 1, startInChannel 2",
              },
              {
                args: [new Float32Array(10), 2, 0],
                name: "Channel 2, startInChannel 0",
              },
              {
                args: [new Float32Array(10), 2, 4],
                name: "Channel 2, startInChannel 3",
              },
              {
                args: [new Float32Array(10), 3, 2],
                name: "Channel 3, startInChannel 2",
              },
              {
                args: [new Float32Array(10), 3, 5],
                name: "Channel 3, startInChannel 5",
              },
              ...createCommonNumberTestArgs<{
                args: [Float32Array, number, number?]
                name: string
              }>((channelNumber) => ({
                args: [new Float32Array(10), channelNumber],
                name: `(Gen) Channel ${channelNumber}`,
              })),
              ...createCommonNumberTestArgs<{
                args: [Float32Array, number, number?]
                name: string
              }>((channelNumber) => ({
                args: [new Float32Array(10), channelNumber, 0],
                name: `(Gen) Channel ${channelNumber}, startInChannel 0`,
              })),
              ...createCommonNumberTestArgs<{
                args: [Float32Array, number, number?]
                name: string
              }>((channelNumber) => ({
                args: [new Float32Array(10), channelNumber, 1],
                name: `(Gen) Channel ${channelNumber}, startInChannel 1`,
              })),
              ...createCommonNumberTestArgs<{
                args: [Float32Array, number, number?]
                name: string
              }>((startInChannel) => ({
                args: [new Float32Array(10), 0, startInChannel],
                name: `(Gen) Channel ${0}, startInChannel ${startInChannel}`,
              })),
              ...createCommonNumberTestArgs<{
                args: [Float32Array, number, number?]
                name: string
              }>((combo) => ({
                args: [new Float32Array(10), combo, combo],
                name: `(Gen) Channel ${combo}, startInChannel ${combo}`,
              })),
            ],
            getChannelData: [
              {
                args: [0],
                name: "First channel",
                stringifyResult: stringifyGetChannelDataResult,
              },
              {
                args: [1],
                name: "Second channel",
                stringifyResult: stringifyGetChannelDataResult,
              },
              {
                args: [2],
                name: "Third channel",
                stringifyResult: stringifyGetChannelDataResult,
              },
              ...createCommonNumberTestArgs<{ args: [number]; name: string }>(
                (channelNumber) => ({
                  args: [channelNumber],
                  name: `(Gen) Channel ${channelNumber}`,
                  stringifyResult: stringifyGetChannelDataResult,
                })
              ),
            ],
          },
          errorMethods: {
            copyFromChannel: [
              {
                args: [new Float32Array(10), 0, 11],
                name: "startInChannel too high",
              },
              ...createVariedTypeArgs<
                { args: [Float32Array, number, number?]; name: string },
                [Float32Array, number, number?]
              >(
                (args, value, argIndex) => ({
                  args: args as [Float32Array, number, number?],
                  name: `(Gen) Args: ${value} for arg index ${argIndex}`,
                }),
                [new Float32Array(10), 0, 11]
              ),
              ...createMissingArgs<
                { args: [Float32Array, number, number?]; name: string },
                [Float32Array, number, number?]
              >(
                (args, argIndex) => ({
                  args: args as [Float32Array, number, number?],
                  name:
                    argIndex === 0
                      ? "(Gen) no args"
                      : `(Gen) Args only up to arg index ${argIndex}`,
                }),
                [new Float32Array(10), 0, 11]
              ),
            ],
            copyToChannel: [
              {
                args: [new Float32Array(10), 0, 11],
                name: "startInChannel too high",
              },
              ...createVariedTypeArgs(
                (args, value, argIndex) => ({
                  args,
                  name: `(Gen) Args: ${value} for arg index ${argIndex}`,
                }),
                [new Float32Array(10), 0, 11]
              ),
              ...createMissingArgs(
                (args, argIndex) => ({
                  args,
                  name:
                    argIndex === 0
                      ? "(Gen) no args"
                      : `(Gen) Args only up to arg index ${argIndex}`,
                }),
                [new Float32Array(10), 0, 11]
              ),
            ],
            getChannelData: [
              {
                args: [1_000_000_000],
                name: "Very high channel",
              },
              ...createVariedTypeArgs(
                (args, value) => ({
                  args: args as [number],
                  name: `(Gen) Args: ${value}`,
                }),
                [2]
              ),
              ...createMissingArgs(
                (args, argIndex) => ({
                  args: args as [number],
                  name:
                    argIndex === 0
                      ? "(Gen) no args"
                      : `(Gen) Args only up to arg index ${argIndex}`,
                }),
                [2]
              ),
            ],
          },
        })
      },
    },
  },
}
