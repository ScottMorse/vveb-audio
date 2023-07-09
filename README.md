# vveb-audio 🧛🎶

_I vvant to make a virtual audio processing graph_

This is a project in early development for a suite of useful TypeScript packages on top of the Web Audio API.

Goals:
* Create a core package of utilities on top of the Web Audio API that allow the optional usage of `standardized-audio-context` in place of the native API
  * This package can also export advanced type utilities on top of the native Web Audio types (or `standardized-audio-context`) 
* Create a framework-agnostic package that provides a functional, reactive virtual state graph on top of a Web Audio processing graph.
* Create an initial React package or submodule of the graph package that implements hook and/or component-based utilities for reading and operating on the graph state.
* Experimental: Provide a testing package with a complete mock of the Web Audio API, minus actual audio data processing.

VVeb Audio is not accepting outside contributors at this time.
