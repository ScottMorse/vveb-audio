import { PartiallyRequired } from "@@core/internal/util/types"
import { useId } from "react"
import { useTestGroupContext } from "./testGroupContext"

export interface ApiTestResult {
  /** An array of `Errors` or at least objects with a `message` property */
  errors: PartiallyRequired<Partial<Error>, "message">[]
}

export interface ApiTestProps {
  testId: string
  run: () => void
}

export const ApiTest = ({ testId, run }: ApiTestProps) => {
  const id = useId()

  const { result, name, isRunning, attemptCount } = useTestGroupContext(
    (state) => state.tests[testId]
  )

  const _hasErrors = (r: typeof result): r is ApiTestResult =>
    !!r?.errors.length
  const _hasSuccess = (r: typeof result): r is ApiTestResult =>
    !!r && !_hasErrors(r)

  const hasErrors = _hasErrors(result)
  const hasSuccess = _hasSuccess(result)

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
          margin: "5px",
        }}
      >
        <button
          onClick={run}
          disabled={isRunning}
          style={{ minWidth: "80px", height: "30px" }}
        >
          {isRunning ? "Running..." : "Run Test"}
        </button>
        <div style={{ fontWeight: "bold" }}>
          {name}
          {attemptCount > 1 && (
            <div style={{ color: "lightsteelblue", fontSize: "0.8rem" }}>
              {" "}
              Attempt {attemptCount}
            </div>
          )}
        </div>
        {hasErrors && (
          <div>
            <div style={{ color: "lightcoral" }}>
              Failed with {result?.errors.length} error
              {result?.errors.length > 1 ? "s" : ""}:
            </div>
            <ul>
              {result.errors.map((error, index) => (
                <li key={id + index} style={{ whiteSpace: "pre-line" }}>
                  {error.message.replace(/\\'/g, "'").replace(/\\n/g, "\n")}
                </li>
              ))}
            </ul>
          </div>
        )}
        {hasSuccess && (
          <div
            style={{
              color: "lightseagreen",
              fontWeight: "bold",
              fontStyle: "italic",
            }}
          >
            Success!
          </div>
        )}
      </div>

      {hasErrors && (
        <div
          style={{ width: "100%", height: "1px", backgroundColor: "lightgray" }}
        />
      )}
    </div>
  )
}
