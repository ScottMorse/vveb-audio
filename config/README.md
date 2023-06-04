# @smorsic/config

This contains project configuration files for each kind of target runtime/framework/etc. we have a package for. The configuration files here should be any extendible file that is scoped to a package. Our goal is to have all internal packages reference only these configuration files for their tsconfig.json, ESLint config, etc.

There is a graph of parent-child configs here, all ultimately inheriting from a base config that contains any runtime/framework-agnostic configuration.

The base files should be our default choice for any config in order to keep consistency in code usage throughout the monorepo, only adding to child configs if the addition is truly only applicable for it. For example, a React ESLint config should not alter or specify rules about variable naming, unless there is a linting issue specific to a desired React variable naming convention.

Note that Jest configuration utilities are found in the @smorsic/testing/jest module.
