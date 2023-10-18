import { useAppContext } from "./lib/appContext"

export const DeviceSettings = () => {
  const { mockWebAudio, updateDeviceSettings } = useAppContext()

  return (
    <div>
      <h3>Device Settings</h3>
      <div style={{ marginBottom: "1rem" }}>
        Note that this app attempts to programmatically detect the appropriate
        initial values here.
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          fontSize: "0.85rem",
        }}
      >
        <div>
          Min Sample Rate:{" "}
          <input
            type="number"
            value={mockWebAudio.deviceSettings.minSampleRate}
            onChange={(e) => {
              updateDeviceSettings({
                minSampleRate: parseInt(e.target.value),
              })
            }}
          />
        </div>
        <div>
          Max Sample Rate:{" "}
          <input
            type="number"
            value={mockWebAudio.deviceSettings.maxSampleRate}
            onChange={(e) => {
              updateDeviceSettings({
                maxSampleRate: parseInt(e.target.value),
              })
            }}
          />
        </div>
        <div>
          Buffer Max Channels:{" "}
          <input
            type="number"
            value={mockWebAudio.deviceSettings.audioBufferMaxChannelCount}
            onChange={(e) => {
              updateDeviceSettings({
                audioBufferMaxChannelCount: parseInt(e.target.value),
              })
            }}
          />
        </div>
        <div>
          Destination Max Channels:{" "}
          <input
            type="number"
            value={mockWebAudio.deviceSettings.destinationMaxChannelCount}
            onChange={(e) => {
              updateDeviceSettings({
                destinationMaxChannelCount: parseInt(e.target.value),
              })
            }}
          />
        </div>
        <div>
          Base Latency:{" "}
          <input
            type="number"
            value={mockWebAudio.deviceSettings.audioContextBaseLatency}
            onChange={(e) => {
              updateDeviceSettings({
                audioContextBaseLatency: parseInt(e.target.value),
              })
            }}
          />
        </div>
        <div>
          Output Latency:{" "}
          <input
            type="number"
            value={mockWebAudio.deviceSettings.audioContextOutputLatency}
            onChange={(e) => {
              updateDeviceSettings({
                audioContextOutputLatency: parseInt(e.target.value),
              })
            }}
          />
        </div>
      </div>
    </div>
  )
}
