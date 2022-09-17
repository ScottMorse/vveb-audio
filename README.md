# vveb-audio 🧛

_I vvant to make a virtual audio processing graph_

## Requirements

- NodeJS (see the `.nvmrc` file for version)

## Project Goals

This is a very new project, so there is a lot of groundwork to be laid.

The primary goal is to provide a library that allows a developer to
create and manage a virtual [audio processing graph](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Basic_concepts_behind_Web_Audio_API#audio_graphs).

This is built on top of the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API), essentially providing a state layer directly above the Web Audio API, similar to a virtual DOM.

The virtual audio graph should be easily serializable to JSON, so a configuration can be sent or stored as plain text data.

This should follow the rules of the Web Audio API, such as "A source node can take no input."

An indirect aim of this project is to enhance the Web Audio development experience with TypeScript, providing types not supported by the underlying API that can enforce rules and provide more specific type narrowing, such as the categorization of AudioNodes into kinds **source**, **destination**, and **effect**.

### Code Practices

- All source files should be written in TypeScript
- Employ multi-paradigm style, with preference for pure functions
- Use of `index.ts` is encouraged, but only for re-exporting (no new variables)
- Prefer feature packaging over layer packaging
- Organize code with bundle-splitting in mind, especially in cases where specific library/framework bindings are created, such as for React, which should never be part of the main module. Core utilities can be exported from the main module. Imports from libraries that can be bundle-split should be, such as `lodash`.
- Library dependencies should be minimal, within reason
- Prettier is used for automated formatting
- ESLint is used for linting

## Project major TODOs

- Test coverage for native web audio AudioNode module
- Refinement of VirtualAudioGraph in general
- Test coverage of VirtualAudioGraph
- Support for custom AudioNode subclasses (requires extendible config in nativeWebAudio/audioNode and supporting types for TS module augmentation)
- React bindings
- Sandbox/demos
- Build & publish process
- Contribution docs
- API docs
