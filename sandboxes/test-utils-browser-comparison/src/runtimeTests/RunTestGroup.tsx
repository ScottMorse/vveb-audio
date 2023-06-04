import { ReactNode, useCallback, useEffect, useState } from "react"
import { RunTest } from "./RunTest"

export const RunTestGroup = ({
  group,
  tests,
}: {
  group: string
  tests: {
    name: string
    test: () => Promise<unknown>
  }[]
  children?: ReactNode
}) => {
  const [isRunningAll, setIsRunningAll] = useState(false)
  const [testsRan, setTestsRan] = useState<number>(0)

  useEffect(() => {
    if (isRunningAll && testsRan >= tests.length) {
      setIsRunningAll(false)
      setTestsRan(0)
    }
  }, [isRunningAll, tests, testsRan])

  return (
    <div>
      <h5>{group}</h5>
      {isRunningAll ? (
        "Waiting for all tests to finish..."
      ) : (
        <button onClick={() => setIsRunningAll(true)}>Run All</button>
      )}
      {tests.map((test) => (
        <div key={`test-group-${group}-${test.name}`}>
          <RunTest
            name={test.name}
            test={test.test}
            autoRun={isRunningAll}
            onFinish={useCallback(() => {
              setTestsRan((testsRan) => testsRan + 1)
            }, [])}
          />
        </div>
      ))}
    </div>
  )
}
