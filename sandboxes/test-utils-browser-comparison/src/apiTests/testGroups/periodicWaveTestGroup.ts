import {
  compareClass,
  createCommonNumberTestArgs,
  createVariedTypeArgs,
} from "src/lib/testUtils"
import { TestGroupConfig } from "../testGroupConfig"

export const PERIODIC_WAVE_TEST_GROUP: TestGroupConfig = {
  name: "PeriodicWave",
  tests: {
    compareClass: {
      name: "Compare Class",
      run: ({ mockWebAudio }) => {
        return compareClass({
          name: "Mock Periodic Wave",
          real: PeriodicWave,
          mock: mockWebAudio.api.PeriodicWave,
          constructorArgLists: [
            {
              args: [new AudioContext()],
              name: "With AudioContext",
            },
            {
              args: [
                new OfflineAudioContext({
                  length: 10,
                  sampleRate: 48000,
                }),
              ],
              name: "With OfflineAudioContext",
            },
            {
              args: [
                new OfflineAudioContext({
                  length: 10,
                  sampleRate: 48000,
                }),
                {
                  disableNormalization: true,
                  imag: new Float32Array([1, 2, 3]),
                  real: new Float32Array([1, 2, 3]),
                },
              ],
              name: "With OfflineAudioContext and options",
            },
            {
              args: [
                new OfflineAudioContext({
                  length: 10,
                  sampleRate: 48000,
                }),
                {
                  disableNormalization: true,
                  imag: new Float32Array([]),
                  real: new Float32Array([]),
                },
              ],
              name: "With length 0 arrays",
            },
            {
              args: [
                new OfflineAudioContext({
                  length: 10,
                  sampleRate: 48000,
                }),
                {
                  disableNormalization: true,
                  imag: new Float32Array([1]),
                  real: new Float32Array([1]),
                },
              ],
              name: "With length 1 arrays",
            },
            {
              args: [
                new OfflineAudioContext({
                  length: 10,
                  sampleRate: 48000,
                }),
                {
                  disableNormalization: true,
                  imag: new Float32Array([1, 2]),
                  real: new Float32Array([1]),
                },
              ],
              name: "With length 1 real, length 2 imag",
            },
            {
              args: [
                new OfflineAudioContext({
                  length: 10,
                  sampleRate: 48000,
                }),
                {
                  disableNormalization: true,
                  imag: new Float32Array([1]),
                  real: new Float32Array([1, 2]),
                },
              ],
              name: "With length 2 real, length 1 imag",
            },
            {
              args: [
                new OfflineAudioContext({
                  length: 10,
                  sampleRate: 48000,
                }),
                {
                  disableNormalization: true,
                  imag: [1, 2, 3],
                  real: [1, 2, 3],
                },
              ],
              name: "With plain Arrays",
            },
            {
              args: [
                new OfflineAudioContext({
                  length: 10,
                  sampleRate: 48000,
                }),
                {
                  imag: new Float32Array([1, 2, 3]),
                  real: new Float32Array([1, 2, 3]),
                },
              ],
              name: "With arrays and no disableNormalization",
            },
            {
              args: [
                new OfflineAudioContext({
                  length: 10,
                  sampleRate: 48000,
                }),
                {
                  imag: new Float32Array([1, 2, 3]),
                },
              ],
              name: "With imag only",
            },
            {
              args: [
                new OfflineAudioContext({
                  length: 10,
                  sampleRate: 48000,
                }),
                {
                  real: new Float32Array([1, 2, 3]),
                },
              ],
              name: "With real only",
            },
            ...createCommonNumberTestArgs<{
              args: ConstructorParameters<typeof PeriodicWave>
              name: string
            }>((x) => ({
              args: [
                new OfflineAudioContext({
                  length: 10,
                  sampleRate: 48000,
                }),
                {
                  imag: new Float32Array([x, x, x]),
                  real: new Float32Array([x, x, x]),
                },
              ],
              name: `With ${x} for all imag/real values`,
            })),
            ...createCommonNumberTestArgs<{
              args: ConstructorParameters<typeof PeriodicWave>
              name: string
            }>((x) => ({
              args: [
                new OfflineAudioContext({
                  length: 10,
                  sampleRate: 48000,
                }),
                {
                  imag: new Float32Array([x, 2, 3]),
                  real: new Float32Array([x, 2, 3]),
                },
              ],
              name: `With ${x} for first imag/real values`,
            })),
            ...createCommonNumberTestArgs<{
              args: ConstructorParameters<typeof PeriodicWave>
              name: string
            }>((x) => ({
              args: [
                new OfflineAudioContext({
                  length: 10,
                  sampleRate: 48000,
                }),
                {
                  imag: new Float32Array([1, 2, x]),
                },
              ],
              name: `With ${x} for third imag value`,
            })),
            ...createCommonNumberTestArgs<{
              args: ConstructorParameters<typeof PeriodicWave>
              name: string
            }>((x) => ({
              args: [
                new OfflineAudioContext({
                  length: 10,
                  sampleRate: 48000,
                }),
                {
                  real: new Float32Array([1, 2, x]),
                },
              ],
              name: `With ${x} for third real values`,
            })),
          ],
          errorConstructorArgLists: [
            {
              args: [],
              name: "No args",
            },
            ...createVariedTypeArgs(
              (args, value, index) => ({
                args,
                name: `With ${value} for ${
                  index === 0 ? "first (context)" : "second (options)"
                } arg`,
              }),
              [
                new OfflineAudioContext({
                  length: 10,
                  sampleRate: 48000,
                }),
                {
                  imag: new Float32Array([1, 2, 3]),
                  real: new Float32Array([1, 2, 3]),
                },
              ]
            ),
            ...createVariedTypeArgs(
              (args, value) => ({
                args: [
                  new OfflineAudioContext({
                    length: 10,
                    sampleRate: 48000,
                  }),
                  {
                    imag: value,
                  },
                ],
                name: `With ${value} for imag option`,
              }),
              [
                new OfflineAudioContext({
                  length: 10,
                  sampleRate: 48000,
                }),
              ]
            ),
            ...createVariedTypeArgs(
              (args, value) => ({
                args: [
                  new OfflineAudioContext({
                    length: 10,
                    sampleRate: 48000,
                  }),
                  {
                    real: value,
                  },
                ],
                name: `With ${value} for real option`,
              }),
              [
                new OfflineAudioContext({
                  length: 10,
                  sampleRate: 48000,
                }),
              ]
            ),
            ...createVariedTypeArgs(
              (args, value) => ({
                args: [
                  new OfflineAudioContext({
                    length: 10,
                    sampleRate: 48000,
                  }),
                  {
                    imag: [value, value, value],
                    real: new Float32Array([1, 2, 3]),
                  },
                ],
                name: `With ${value} for imag array value`,
              }),
              [
                new OfflineAudioContext({
                  length: 10,
                  sampleRate: 48000,
                }),
              ]
            ),
            ...createVariedTypeArgs(
              (args, value) => ({
                args: [
                  new OfflineAudioContext({
                    length: 10,
                    sampleRate: 48000,
                  }),
                  {
                    imag: new Float32Array([1, 2, 3]),
                    real: [value, value, value],
                  },
                ],
                name: `With ${value} for real array value`,
              }),
              [
                new OfflineAudioContext({
                  length: 10,
                  sampleRate: 48000,
                }),
              ]
            ),
            ...createVariedTypeArgs(
              (args, value) => ({
                args: [
                  new OfflineAudioContext({
                    length: 10,
                    sampleRate: 48000,
                  }),
                  {
                    disableNormalization: value,
                    imag: new Float32Array([1, 2, 3]),
                    real: new Float32Array([1, 2, 3]),
                  },
                ],
                name: `With ${value} for disableNormalization`,
              }),
              [
                new OfflineAudioContext({
                  length: 10,
                  sampleRate: 48000,
                }),
              ]
            ),
          ],
        })
      },
    },
  },
}
