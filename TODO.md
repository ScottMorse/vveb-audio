# TODO

## Test utils:

- AudioBuffer: copyChannelData etc. implemented?
- OfflineAudioContext: utility to set the rendered buffer ahead of time?
- Handle resolution of internal classes when user excluded class globally (e.g. what should BaseAudioContext.createPeriodicWave return if user excluded PeriodicWave?)
- Look for todo comments
- Configurable interval for currentTime increments (complex feature)
- Implement AudioParam with tests (complex feature)
- Implement AudioWorklet-related mocking (complex feature)
- Top level API: mocking api globally with Jest tests to verify
- Whole code pass
- Publish and release process

### Test browser utils:

- Test audio node methods with varied/erroneous args for AudioContext/BaseAudioContext
  - Ensure that OfflineAudioContext has similar message for invalid args
- More tests for AudioContext state methods perhaps
- Figure out why currentTime test sometimes passes, sometimes fails
- AudioParam tests
- AudioWorklet tests where possible
