import { useCallback, useId } from "react"
import { useAppContext } from "src/lib/appContext"
import { ApiTest } from "./ApiTest"
import { TestGroupConfig } from "./testGroupConfig"
import {
  TestGroupContextProvider,
  useTestGroupContext,
} from "./testGroupContext"

export interface ApiTestGroupProps {
  config: TestGroupConfig
}

const InnerApiTestGroup = ({ config }: ApiTestGroupProps) => {
  const id = useId()

  const tests = useTestGroupContext((state) => state.tests)
  const updateTestState = useTestGroupContext((state) => state.updateTest)

  const appState = useAppContext()

  const runTest = useCallback(
    async (testId: string) => {
      updateTestState(testId, ({ attemptCount }) => ({
        isRunning: true,
        attemptCount: attemptCount + 1,
      }))
      try {
        const result = await config.tests[testId].run(appState)
        updateTestState(testId, { isRunning: false, result })
      } catch (error) {
        console.error(error)
        updateTestState(testId, {
          isRunning: false,
          result: { errors: [error as Error] },
        })
      }
    },
    [tests, updateTestState, config, appState]
  )

  const runAllTests = useCallback(async () => {
    for (const testId in config.tests) {
      runTest(testId)
    }
  }, [config, runTest])

  return (
    <div>
      <div style={{ display: "flex", gap: "19px", alignItems: "center" }}>
        <h3>{config.name}</h3>
        <button
          style={{ height: "24px", minWidth: "60px", fontWeight: "bold" }}
          onClick={runAllTests}
        >
          Run All
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {Object.keys(config.tests).map((testId) => (
          <ApiTest
            key={id + testId}
            testId={testId}
            run={() => runTest(testId)}
          />
        ))}
      </div>
    </div>
  )
}

export const ApiTestGroup = ({ config }: ApiTestGroupProps) => {
  return (
    <TestGroupContextProvider config={config}>
      <InnerApiTestGroup config={config} />
    </TestGroupContextProvider>
  )
}
