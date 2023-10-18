import { ApiTestGroup } from "./apiTests/ApiTestGroup"
import { TestGroupConfig } from "./apiTests/testGroupConfig"
import { AUDIO_BUFFER_TEST_GROUP } from "./apiTests/testGroups/audioBufferTestGroup"
import { AUDIO_CONTEXT_TEST_GROUP } from "./apiTests/testGroups/audioContextTestGroup"
import { AUDIO_LISTENER_TEST_GROUP } from "./apiTests/testGroups/audioListenerTestGroup"
import { AUDIO_PARAM_TEST_GROUP } from "./apiTests/testGroups/audioParamTestGroup"
import { MEDIA_STREAM_TEST_GROUP } from "./apiTests/testGroups/mediaStreamTestGroup"
import { MEDIA_STREAM_TRACK_TEST_GROUP } from "./apiTests/testGroups/mediaStreamTrackTestGroup"
import { OFFLINE_AUDIO_CONTEXT_TEST_GROUP } from "./apiTests/testGroups/offlineAudioContextTestGroup"
import { PERIODIC_WAVE_TEST_GROUP } from "./apiTests/testGroups/periodicWaveTestGroup"

const TEST_GROUPS: TestGroupConfig[] = [
  AUDIO_PARAM_TEST_GROUP,
  AUDIO_BUFFER_TEST_GROUP,
  PERIODIC_WAVE_TEST_GROUP,
  AUDIO_LISTENER_TEST_GROUP,
  MEDIA_STREAM_TEST_GROUP,
  MEDIA_STREAM_TRACK_TEST_GROUP,
  AUDIO_CONTEXT_TEST_GROUP,
  OFFLINE_AUDIO_CONTEXT_TEST_GROUP,
]

export const AllTests = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <h2>Tests</h2>
      {TEST_GROUPS.map((group) => (
        <ApiTestGroup key={"test-group" + group.name} config={group} />
      ))}
    </div>
  )
}
