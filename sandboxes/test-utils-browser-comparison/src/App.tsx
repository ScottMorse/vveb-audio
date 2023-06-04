import { AppContextProvider } from "./lib/appContext"
import { RuntimeTests } from "./runtimeTests"

export const App = () => {
  return (
    <AppContextProvider>
      <div>
        <h1>Web Audio Test Utils</h1>
        <p>
          This app is meant to compare the mock Web Audio API classes provided
          by @@test-utils with the real Web Audio API classes.
        </p>
        <RuntimeTests />
      </div>
    </AppContextProvider>
  )
}
