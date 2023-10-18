import { AllTests } from "./AllTests"
import { DeviceSettings } from "./DeviceSettings"
import { AppContextProvider } from "./lib/appContext"

export const App = () => {
  return (
    <AppContextProvider>
      <div>
        <h1>Web Audio Test Utils</h1>
        <p>
          This app is meant to compare the mock Web Audio API classes provided
          by @@test-utils with the real Web Audio API classes.
        </p>
        <DeviceSettings />
        <AllTests />
      </div>
    </AppContextProvider>
  )
}
