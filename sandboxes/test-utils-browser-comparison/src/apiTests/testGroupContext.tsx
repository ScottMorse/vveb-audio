import { createContext, ReactNode, useContext } from "react"
import { useStore } from "zustand"
import { createStore, StoreApi } from "zustand/vanilla"
import { ApiTestResult } from "./ApiTest"
import { TestConfig, TestGroupConfig } from "./testGroupConfig"

export interface TestState {
  result: ApiTestResult | null
  isRunning: boolean
  name: string
  attemptCount: number
}

export type TestGroupState<TestId extends string = string> = {
  tests: { [testId in TestId]: TestState }
  updateTest: (
    testId: TestId,
    state: Partial<TestState> | ((testState: TestState) => Partial<TestState>)
  ) => void
}

const createTestGroupStore = <TestId extends string>(
  config: TestGroupConfig<TestId>
) => {
  const testStates = Object.entries(config.tests).reduce(
    (acc, [testId, testConfig]) => {
      acc[testId as TestId] = {
        result: null,
        isRunning: false,
        name: (testConfig as TestConfig).name,
        attemptCount: 0,
      }
      return acc
    },
    {} as { [testId in TestId]: TestState }
  )

  return createStore<TestGroupState<TestId>>((set) => ({
    tests: testStates,
    updateTest: (testId, newState) => {
      set((state) => ({
        ...state,
        tests: {
          ...state.tests,
          [testId]: {
            ...state.tests[testId],
            ...(typeof newState === "function"
              ? newState(state.tests[testId])
              : newState),
          },
        },
      }))
    },
  }))
}

const TestGroupContext = createContext<StoreApi<TestGroupState>>(
  null as unknown as StoreApi<TestGroupState>
)

export interface TestGroupContextProviderProps<TestId extends string> {
  children: ReactNode
  config: TestGroupConfig<TestId>
}

export const TestGroupContextProvider = <TestId extends string>({
  config,
  children,
}: TestGroupContextProviderProps<TestId>) => {
  const store = createTestGroupStore<TestId>(config)

  return (
    <TestGroupContext.Provider value={store as any}>
      {children}
    </TestGroupContext.Provider>
  )
}

export const useTestGroupContext = <TestId extends string, R>(
  selector: (state: TestGroupState<TestId>) => R
) => useStore(useContext(TestGroupContext), selector)
