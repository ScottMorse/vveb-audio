import { useCallback, useRef } from "react"
import { useAppContext } from "../lib/appContext"
import { Mock } from "../lib/engine"
import { RunTestGroup } from "./RunTestGroup"
import { RuntimeTestFunction } from "./runtimeTest"
import { TESTS } from "./tests"

export const RuntimeTests = () => {
  const {
    audioContext,
    setAudioContext,
    mockAudioContext,
    setMockAudioContext,
    offlineContext,
    mockOfflineContext,
  } = useAppContext()

  const ctxRef = useRef(audioContext)
  const mockCtxRef = useRef(mockAudioContext)

  const wrapTest = useCallback(
    (func: RuntimeTestFunction) => () => {
      let ctx = ctxRef.current
      let mockCtx = mockCtxRef.current
      if (!ctx) {
        ctx = new AudioContext({
          sampleRate: 12345,
        })
        setAudioContext(ctx)
        ctxRef.current = ctx
      }
      if (!mockCtx) {
        mockCtx = new Mock.AudioContext({
          sampleRate: 12345,
        })
        setMockAudioContext(mockCtx)
        mockCtxRef.current = mockCtx
      }
      return func({
        ctx,
        mockCtx,
        offlineCtx: offlineContext,
        mockOfflineCtx: mockOfflineContext,
      })
    },
    []
  )

  return (
    <div>
      {Object.entries(TESTS).map(([group, tests]) => {
        return (
          <RunTestGroup
            key={`test-group-${group}`}
            group={group}
            tests={tests.map((test) => ({
              ...test,
              test: wrapTest(test.test),
            }))}
          />
        )
      })}
    </div>
  )
}
