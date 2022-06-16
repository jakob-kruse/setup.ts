---
title: Plugin Introduction
description: Docs intro
layout: ../../layouts/MainLayout.astro

setup: |
  import { Code } from 'astro/components'
  import { Icon } from 'astro-icon'
---

# Plugin Introduction

This guide will get you started with setup.ts' plugin system. We will cover how to use plugins, what they can do and how to write your own.

## Understanding the setup.ts flow

To understand plugins, we have to understand that setup.ts is basically a JSON generator. When setup.ts is run, it bundles and imports `setup.ts` and uses the SetupBuilder returned by `defineSetup` to "compile" the final package.json.

### Example

Let's say we have a very basic `setup.ts`.

```ts
// setup.ts
import { defineSetup } from "@setup.ts/setup";

const dynamicDescription = 1 == 1 ? "1 is 1, wow!" : "Im confused";

export default defineSetup({
  name: "my-package",
  version: "0.0.1",
  description: dynamicDescription,
});
```

The resulting package.json would look like this

```json
// package.json
{
  "name": "my-package",
  "version": "0.0.1",
  "description": "1 is 1, wow!"
}
```

## What can plugins do?

Plugins have a variety of use-cases and can be customized by configs. They are inspired by ViteJS plugins.

- Modify the resulting package.json
- Create new files from templates

Plugins return a partial package definition. This will be merged with the result of defineSetup. Plugins can be sync or async.

## Writing a plugin

setup.ts exports a plugin helper function. This function is called `definePlugin` and takes a config object.

### Example

Let's say we want a plugin that changes the version of our package. We can write a plugin like this

```ts
import { definePlugin } from "@setup.ts/setup";

const changeVersionPlugin = definePlugin<{ version: string }>((config) => ({
  mergePackage: {
    version: config.version,
  },
}));
```

Now we can apply that to our previous example, like this

```ts
// setup.ts
import { defineSetup } from "@setup.ts/setup";

const dynamicDescription = 1 == 1 ? "1 is 1, wow!" : "Im confused";

const changeVersionPlugin = definePlugin<{ version: string }>(({ config }) => ({
  mergePackage: {
    version: config.version,
  },
}));

export default defineSetup({
  name: "my-package",
  version: "0.0.1",
  description: dynamicDescription,
}).use(changeVersionPlugin({ version: "0.0.2" }));
```

The resulting package.json would look like this

```json
// package.json
{
  "name": "my-package",
  "version": "0.0.2",
  "description": "1 is 1, wow!"
}
```

### Plugin context and different syntaxes

The define plugin takes a function with the plugin context object as the first argument. It has the following properties

    - config: The config object passed to definePlugin with the type defined in the generic type.
    - mergePackage: A function to merge the provided object with the resulting package.json. This is useful for conditionals inside the plugin.
    - registerFiles: A function to register files with or without a template.

To learn more see [Advanced Plugins](/plugins/advanced)
