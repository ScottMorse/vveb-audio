import { ReactNode, useCallback, useEffect, useState } from "react"

export const RunTest = ({
  name,
  test,
  autoRun,
  onFinish,
}: {
  name: string
  test: () => Promise<unknown>
  children?: ReactNode
  autoRun?: boolean
  onFinish?: () => void
}) => {
  const [step, setStep] = useState<"preTest" | "test" | "postTest">("preTest")
  const [error, setError] = useState<Error | null>(null)

  const run = useCallback(async () => {
    setError(null)
    setStep("test")
    try {
      await test()
    } catch (error) {
      setError(error as Error)
      console.error(error)
    } finally {
      setStep("postTest")
      onFinish?.()
    }
  }, [test])

  useEffect(() => {
    if (autoRun) {
      run()
    }
  }, [autoRun])

  switch (step) {
    case "preTest":
      return (
        <div style={{ display: "flex", gap: "5px", margin: "5px" }}>
          <div>{name}</div>
          <button onClick={run}>Run Test</button>
        </div>
      )
    case "test":
      return <div>Running test...</div>
    case "postTest":
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            margin: "5px",
          }}
        >
          <div>{name}</div>
          <button style={{ maxHeight: "2rem" }} onClick={run}>
            Rerun
          </button>
          <pre style={{ margin: 0 }}>
            {error
              ? "❌ Test failed: " + error.message.replace(/\\'/g, "'")
              : "✅ Test passed"}
          </pre>
        </div>
      )
    default:
      return null
  }
}
