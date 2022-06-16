---
title: Advanced Plugins
description: More information about plugins
layout: ../../layouts/MainLayout.astro

setup: |
  import { Code } from 'astro/components'
  import { Icon } from 'astro-icon'
---

# Advanced Plugins

We covered the basics of plugins in the [previous section](/plugins/introduction). Here we will cover some more advanced topics.

# Different syntaxes

You can use two syntaxes to define the behavior of your plugin.

**You do not have to decide between syntaxes, they can be mixed!**

## Declarative Syntax

```ts
// setup.ts

import { definePlugin } from "@setup.ts/setup";

const declarativePlugin = definePlugin(() => {
  // all changes are returned at the end of the function
  return {
    mergePackageJson: {
      name: "my-plugin",
      version: "0.0.1",
      description: "My plugin",
    },
  };
});
```

## "Function" Syntax

Instead of returning an object, you can call a function that takes the config object to merge.

This is the most flexible syntax, but it is also a bit more verbose. If your plugin has a lot of conditional logic, you might want to use this, to avoid long temary operators or temporary variables.

<div class="shadow-lg alert">
  <div>
    <Icon pack="mdi" name="information" size="24" />
    <span>If you are mixing syntaxes, the functional calls will be executed <b>after</b> the declarative values have been merged.</span>
  </div>
</div>

```ts
// setup.ts

import { definePlugin } from "@setup.ts/setup";

const declarativePlugin = definePlugin(({ mergePackageJson }) => {
  const isMayorRelease = true;

  mergePackageJson({
    name: "my-plugin",
    description: "My plugin",
  });

  if (isMayorRelease) {
    mergePackageJson({
      version: "1.0.0",
    });
  } else {
    mergePackageJson({
      version: "0.0.1",
    });
  }

  // The return value can be ommitted.
});
```
