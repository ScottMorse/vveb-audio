# vveb-audio 🧛🎶

_I vvant to make a virtual audio processing graph_

## Requirements

- NodeJS (see the `.nvmrc` file for version)

## Project Goals

This is a very new project, so there is a lot of groundwork to be laid.

The primary goal is to provide a library that allows a developer to
create and manage a virtual [audio processing graph](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Basic_concepts_behind_Web_Audio_API#audio_graphs).

This is built on top of the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API), essentially providing a state layer directly above it, similar to a [virtual DOM](https://en.wikipedia.org/wiki/Virtual_DOM).

The virtual audio graph should be easily serializable to JSON, so a configuration can be sent or stored as plain text data.

This should follow the rules of the Web Audio API, such as "A source node can take no input."

An indirect aim of this project is to enhance the Web Audio development experience with TypeScript, providing types not supported natively that can enforce rules and provide more specific type narrowing, such as the categorization of AudioNodes into kinds **source**, **destination**, and **effect**.

This library should be fully extensible with custom AudioNode subclasses created by its users.

### Code Practices

- All source files should be written in TypeScript
- Employ multi-paradigm style, with preference for pure functions
- Use of `index.ts` is encouraged, but only for re-exporting (no new variables)
- Naming
  - Prefer medium/long variable names using full words (follow idea that a little verbose is better than too vague)
  - camelCase all variables, args, methods, etc.
  - TitleCase class names, enums, TypeScript types, TypeScript generics
  - SCREAMING_SNAKE_CASE constants
  - snake_case never
  - Do not use a prefixing practice, such as iMyInterface, eMyEnum, cMyClass.
  - Use verbs for functions (some exceptions, such as type narrowing functions like `isType(something)`)
  - Use nouns for most data
  - Use `isName` for booleans
  - Use plural nouns for lists
  - Exported names should especially not be too vague. E.g., export `createAudioNode` is more quickly understood in context than just an export named `create`.
- Prefer feature packaging over layer packaging
- Organize code with bundle-splitting in mind, especially in cases where specific library/framework bindings are created, such as for React, which should never be part of the main module. Core utilities can be exported from the main module. Imports from libraries that can be bundle-split should be, such as `lodash`.
- Library dependencies should be minimal, within reason
- Prettier is used for automated formatting
- ESLint is used for linting

## Project major TODOs

- Test coverage for native web audio AudioNode module
- Test coverage for native web audio AudioContext module
- Refinement of VirtualAudioGraph in general
- Test coverage of VirtualAudioGraph
- Review & update all JSDoc comments
- Logging utility - default configurable print level 0-4 based on whether localhost, logs can be hooked into as event emitter
- Support for custom AudioNode and BaseAudioContext subclasses (requires extendible config and supporting types for TS module augmentation)
- React bindings
- Sandbox/demos
- Build & publish process
- Contribution docs
- API docs
