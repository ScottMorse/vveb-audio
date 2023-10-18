import { MethodKeyName } from "@@core/internal/util/types"
import {
  compareClass,
  compareInstance,
  CompareInstanceOptions,
  compareMethod,
  CompareMethodOptions,
  compareThrow,
} from "./testUtils"

type Pattern = string | RegExp

const getPatternSource = (pattern: Pattern) =>
  pattern instanceof RegExp
    ? pattern.source
    : // eslint-disable-next-line no-useless-escape
      pattern.replace(/[()\[\]]/g, (x) => "\\" + x)

const stringifyErrors = (errors: Error[]) =>
  errors.map((e) => e.message).join("\n")

const createExpectedErrors = (errors: [Pattern, Pattern][]) =>
  new RegExp(
    errors.reduce((source, [a, b]) => {
      const patternA = getPatternSource(a)
      const patternB = getPatternSource(b)
      const nextSource = `${patternA}.*${patternB}`
      return source ? `${source}.*${nextSource}` : nextSource
    }, ""),
    "s"
  )

describe("Test testUtils", () => {
  describe("Compare throw", () => {
    test.each([
      {
        name: "throw different Error message",
        real: () => {
          throw new Error("test")
        },
        mock: () => {
          throw new Error("test2")
        },
        expected: [
          [
            "my test name: thrown error.message: test",
            "my test name: thrown error.message: test2",
          ],
        ],
      },
      {
        name: "throw and no-throw",
        real: () => {
          throw new Error("Error")
        },
        mock: () => {},
        expected: [
          [
            "my test name: threw error: Error",
            "my test name: threw error: (no error)",
          ],
        ],
      },
      {
        name: "no-throw and throw",
        real: () => {},
        mock: () => {
          throw new Error("Error")
        },
        expected: [
          [
            "my test name: threw error: (no error)",
            "my test name: threw error: Error",
          ],
        ],
      },
      {
        name: "Error vs TypeError",
        real: () => {
          throw new Error("message")
        },
        mock: () => {
          throw new TypeError("message")
        },
        expected: [
          [
            "my test name: thrown error.name: Error",
            "my test name: thrown error.name: TypeError",
          ],
        ],
      },
      {
        name: "same Error type, different message",
        real: () => {
          throw new Error("message")
        },
        mock: () => {
          throw new Error("message2")
        },
        expected: [
          [
            "my test name: thrown error.message: message",
            "my test name: thrown error.message: message2",
          ],
        ],
      },
      {
        name: "mixed type and message",
        real: () => {
          throw new Error("message")
        },
        mock: () => {
          throw new TypeError("message2")
        },
        expected: [
          [
            "my test name: thrown error.message: message",
            "my test name: thrown error.message: message2",
          ],
          [
            "my test name: thrown error.name: Error",
            "my test name: thrown error.name: TypeError",
          ],
        ],
      },
    ])(`compareThrow: $name`, ({ real, mock, expected }) => {
      const errors = compareThrow({
        real,
        mock,
        name: "my test name",
      }).errors

      expect(errors).toHaveLength(expected.length)

      expect(stringifyErrors(errors)).toMatch(
        createExpectedErrors(expected as [Pattern, Pattern][])
      )
    })
  })

  describe("compareMethod", () => {
    const dateMethodCase = <M extends MethodKeyName<Date>>(
      options: CompareMethodOptions<M, Date> & {
        expected: [Pattern, Pattern][]
      }
    ) => options

    test.each([
      dateMethodCase({
        name: "Same Date and method",
        real: new Date(0),
        mock: new Date(0),
        method: "getTime",
        args: [],
        stringifyResult: undefined,
        expected: [],
      }),
      dateMethodCase({
        name: "Different Date but same method",
        real: new Date(0),
        mock: new Date(1),
        method: "getTime",
        args: [],
        stringifyResult: undefined,
        expected: [["date test 0", "date test 1"]],
      }),
      dateMethodCase({
        name: "Different Date and custom stringifyResult",
        real: new Date(0),
        mock: new Date(1_000),
        method: "getSeconds",
        args: [],
        stringifyResult: (x: number) => `stringified ${x}`,
        expected: [["date test stringified 0", "date test stringified 1"]],
      }),
    ])(
      "Compare method: $name",
      ({ real, mock, method, args, stringifyResult, expected }) => {
        const errors = compareMethod({
          real,
          mock,
          name: "date test",
          method,
          args,
          stringifyResult,
        }).errors

        expect(errors).toHaveLength(expected.length)

        expect(stringifyErrors(errors)).toMatch(
          createExpectedErrors(expected as [Pattern, Pattern][])
        )
      }
    )
  })

  describe("Compare instance", () => {
    const dateInstanceCase = (
      options: CompareInstanceOptions<Date> & {
        expected: [Pattern, Pattern][]
      }
    ) => options

    test.each([
      dateInstanceCase({
        name: "All methods match",
        real: new Date(0),
        mock: new Date(0),
        props: {},
        methods: {
          getHours: [
            {
              args: [],
              name: "empty",
            },
          ],
          getMinutes: [
            {
              args: [],
              name: "empty",
            },
          ],
          getSeconds: [
            {
              args: [],
              name: "empty",
            },
          ],
          getMilliseconds: [
            {
              args: [],
              name: "empty",
            },
          ],
        },
        expected: [],
      }),
      dateInstanceCase({
        name: "Mismatched milliseconds",
        real: new Date(0),
        mock: new Date(1),
        props: {},
        methods: {
          getHours: [
            {
              args: [],
              name: "empty",
            },
          ],
          getMinutes: [
            {
              args: [],
              name: "empty",
            },
          ],
          getSeconds: [
            {
              args: [],
              name: "empty",
            },
          ],
          getMilliseconds: [
            {
              args: [],
              name: "empty",
            },
          ],
          toTimeString: [
            {
              args: [],
              name: "empty",
            },
          ],
        },
        expected: [
          [
            "date test: Compare Date Instance: Method 'getMilliseconds' (args list: 'empty'): 0",
            "date test: Compare Date Instance: Method 'getMilliseconds' (args list: 'empty'): 1",
          ],
        ],
      }),
      dateInstanceCase({
        name: "Mismatched seconds and milliseconds",
        real: new Date(0),
        mock: new Date(1001),
        props: {},
        methods: {
          getHours: [
            {
              args: [],
              name: "empty",
            },
          ],
          getMinutes: [
            {
              args: [],
              name: "empty",
            },
          ],
          getSeconds: [
            {
              args: [],
              name: "empty",
            },
          ],
          getMilliseconds: [
            {
              args: [],
              name: "empty",
            },
          ],
        },
        expected: [
          [
            "date test: Compare Date Instance: Wed Dec 31 1969 18:00:00 GMT-0600 (Central Standard Time)",
            "date test: Compare Date Instance: Wed Dec 31 1969 18:00:01 GMT-0600 (Central Standard Time)",
          ],
          [
            "date test: Compare Date Instance: Method 'getSeconds' (args list: 'empty'): 0",
            "date test: Compare Date Instance: Method 'getSeconds' (args list: 'empty'): 1",
          ],
          [
            "date test: Compare Date Instance: Method 'getMilliseconds' (args list: 'empty'): 0",
            "date test: Compare Date Instance: Method 'getMilliseconds' (args list: 'empty'): 1",
          ],
        ],
      }),
    ])(
      "Compare instance: $name",
      ({ real, mock, props, methods, expected }) => {
        const errors = compareInstance({
          real,
          mock,
          name: "date test",
          props,
          methods,
        }).errors

        expect(errors).toHaveLength(expected.length)
        expect(stringifyErrors(errors)).toMatch(createExpectedErrors(expected))
      }
    )

    test("Using RegExp to test props", () => {
      let { errors } = compareInstance({
        real: /hello/,
        mock: /hello/,
        name: "RegExp test",
        props: {
          source: null,
          flags: null,
          lastIndex: null,
          ignoreCase: null,
        },
        methods: {
          test: [
            {
              args: ["hello"],
              name: "hello",
            },
            {
              args: ["world"],
              name: "world",
            },
          ],
        },
      })

      expect(errors).toHaveLength(0)

      errors = compareInstance({
        real: /hello/,
        mock: /hello/i,
        name: "RegExp test with wrong flags",
        props: {
          source: null,
          flags: null,
          lastIndex: null,
          ignoreCase: (i) => (i ? "OH YES" : "oh no"),
        },
        methods: {
          test: [
            {
              args: ["hello"],
              name: "hello",
            },
            {
              args: ["HELLO"],
              name: "HELLO",
            },
            {
              args: ["world"],
              name: "world",
            },
          ],
        },
      }).errors

      expect(errors).toHaveLength(4)
      expect(stringifyErrors(errors)).toMatch(
        createExpectedErrors([
          [
            "RegExp test with wrong flags: Compare RegExp Instance: /hello/",
            "RegExp test with wrong flags: Compare RegExp Instance: /hello/i",
          ],
          [
            "RegExp test with wrong flags: Compare RegExp Instance: Prop 'flags': ",
            "RegExp test with wrong flags: Compare RegExp Instance: Prop 'flags': i",
          ],
          [
            "RegExp test with wrong flags: Compare RegExp Instance: Prop 'ignoreCase': oh no",
            "RegExp test with wrong flags: Compare RegExp Instance: Prop 'ignoreCase': OH YES",
          ],
          [
            "RegExp test with wrong flags: Compare RegExp Instance: Method 'test' (args list: 'HELLO'): false",
            "RegExp test with wrong flags: Compare RegExp Instance: Method 'test' (args list: 'HELLO'): true",
          ],
        ])
      )
    })

    test("With test classes", () => {
      class TestClassA {
        testProp = 0

        testMethod(arg: string) {
          if (typeof arg !== "string") {
            throw new TypeError("invalid arg")
          }
          return arg.toUpperCase()
        }
      }

      class TestClassB {
        testProp = 1

        testMethod(arg: string) {
          if (typeof arg !== "string") {
            throw new Error("invalid arg")
          }
          return arg.toLowerCase()
        }
      }

      expect(
        stringifyErrors(
          compareInstance({
            real: new TestClassA(),
            mock: new TestClassB(),
            name: "test class",
          }).errors
        )
      ).toMatch(
        createExpectedErrors([
          [
            "test class: Compare TestClassA Instance: Constructor Name: TestClassA",
            "test class: Compare TestClassA Instance: Constructor Name: TestClassB",
          ],
        ])
      )

      Object.defineProperty(TestClassB, "name", { value: "TestClassA" })

      expect(
        compareInstance({
          real: new TestClassA(),
          mock: new TestClassB(),
          name: "test class",
        }).errors
      ).toHaveLength(0)

      /** @todo IMMEDIATE: errorMethods should cause error */
      expect(
        stringifyErrors(
          compareInstance({
            real: new TestClassA(),
            mock: new TestClassB(),
            name: "test class",
            methods: {
              testMethod: [
                {
                  args: ["Test"],
                  name: "test",
                },
              ],
            },
            errorMethods: {
              testMethod: [
                {
                  args: [],
                  name: "empty",
                },
              ],
            },
          }).errors
        )
      ).toMatch(
        createExpectedErrors([
          [
            "test class: Compare TestClassA Instance: Method 'testMethod' (args list: 'test'): TEST",
            "test class: Compare TestClassA Instance: Method 'testMethod' (args list: 'test'): test",
          ],
          [
            "test class: Compare TestClassA Instance: Error Method 'testMethod' (error args list: 'empty'): thrown error.name: TypeError",
            "test class: Compare TestClassA Instance: Error Method 'testMethod' (error args list: 'empty'): thrown error.name: Error",
          ],
        ])
      )

      // fix errorMethods
      TestClassB.prototype.testMethod = (arg: string) => {
        if (typeof arg !== "string") {
          throw new TypeError("invalid arg")
        }
        return arg.toLowerCase()
      }

      const fixedErrorMethodErrors = compareInstance({
        real: new TestClassA(),
        mock: new TestClassB(),
        name: "test class",
        methods: {
          testMethod: [
            {
              args: ["Test"],
              name: "test",
            },
          ],
        },
        errorMethods: {
          testMethod: [
            {
              args: [],
              name: "empty",
            },
          ],
        },
      }).errors

      expect(fixedErrorMethodErrors).toHaveLength(1)

      expect(stringifyErrors(fixedErrorMethodErrors)).toMatch(
        createExpectedErrors([
          [
            "test class: Compare TestClassA Instance: Method 'testMethod' (args list: 'test'): TEST",
            "test class: Compare TestClassA Instance: Method 'testMethod' (args list: 'test'): test",
          ],
        ])
      )
    })
  })

  describe("Compare class", () => {
    test("Using Map", () => {
      expect(
        compareClass({
          real: Map,
          mock: Map,
          name: "map test",
          props: {
            size: null,
          },
          methods: {
            get: [
              {
                args: ["testKey"],
                name: "get testKey",
              },
            ],
            set: [
              {
                args: ["testKey", "testValue"],
                name: "set testKey to testValue",
              },
            ],
            delete: [
              {
                args: ["testKey"],
                name: "delete testKey",
              },
            ],
          },
          errorMethods: {},
          constructorArgLists: [
            { args: [], name: "empty" },
            {
              args: [[["initialKey", "initialValue"]]],
              name: "initialKey and initialValue",
            },
          ],
          errorConstructorArgLists: [{ args: ["hi"], name: "string" }],
        }).errors
      ).toHaveLength(0)
    })

    test("Using bad Map implementation", () => {
      class BadMap
        implements Pick<Map<string, string>, "size" | "get" | "delete">
      {
        size = 0

        delete(_key: string) {
          return false
        }

        get(key: string) {
          return key
        }
      }

      const { errors } = compareClass({
        real: Map,
        mock: BadMap as unknown as typeof Map,
        name: "bad map test",
        props: {
          size: null,
        },
        methods: {
          get: [
            {
              args: ["testKey"],
              name: "get testKey",
            },
          ],
          delete: [
            {
              args: ["testKey"],
              name: "delete testKey",
            },
          ],
        },
        errorMethods: {},
        constructorArgLists: [
          { args: [], name: "empty" },
          {
            args: [[["initialKey", "initialValue"]]],
            name: "initialKey and initialValue",
          },
        ],
        errorConstructorArgLists: [{ args: ["hi"], name: "string" }],
      })

      expect(errors).toHaveLength(8)
      expect(stringifyErrors(errors)).toMatch(
        createExpectedErrors([
          [
            "bad map test: Compare class Map (args list: 'empty'): Compare Map Instance: Constructor Name: Map",
            "bad map test: Compare class Map (args list: 'empty'): Compare Map Instance: Constructor Name: BadMap",
          ],
          [
            "bad map test: Compare class Map (args list: 'empty'): Compare Map Instance: [object Map]",
            "bad map test: Compare class Map (args list: 'empty'): Compare Map Instance: [object Object]",
          ],
          [
            "bad map test: Compare class Map (args list: 'empty'): Compare Map Instance: Method 'get' (args list: 'get testKey'): undefined",
            "bad map test: Compare class Map (args list: 'empty'): Compare Map Instance: Method 'get' (args list: 'get testKey'): testKey",
          ],
          [
            "bad map test: Compare class Map (args list: 'initialKey and initialValue'): Compare Map Instance: Constructor Name: Map",
            "bad map test: Compare class Map (args list: 'initialKey and initialValue'): Compare Map Instance: Constructor Name: BadMap",
          ],
          [
            "bad map test: Compare class Map (args list: 'initialKey and initialValue'): Compare Map Instance: [object Map]",
            "bad map test: Compare class Map (args list: 'initialKey and initialValue'): Compare Map Instance: [object Object]",
          ],
          [
            "bad map test: Compare class Map (args list: 'initialKey and initialValue'): Compare Map Instance: Prop 'size': 1",
            "bad map test: Compare class Map (args list: 'initialKey and initialValue'): Compare Map Instance: Prop 'size': 0",
          ],
          [
            "bad map test: Compare class Map (args list: 'initialKey and initialValue'): Compare Map Instance: Method 'get' (args list: 'get testKey'): undefined",
            "bad map test: Compare class Map (args list: 'initialKey and initialValue'): Compare Map Instance: Method 'get' (args list: 'get testKey'): testKey",
          ],
          [
            "bad map test: Compare class Map (error args list: 'string'): threw error: Iterator value h is not an entry object",
            "bad map test: Compare class Map (error args list: 'string'): threw error: (no error)",
          ],
        ])
      )
    })
  })
})
