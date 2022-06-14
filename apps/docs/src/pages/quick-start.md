---
title: Quick Start
description: Get started quickly with setup.ts
layout: ../layouts/MainLayout.astro

setup: |
  import { Icon } from 'astro-icon'
---

# Quick Start

The following guide will get you up and running as quickly as possible, while also teaching you the fundamentals of setup.ts

<div class="shadow-lg alert">
  <div>
    <Icon pack="mdi" name="information" size="24" />
    <span>The following examples will use **pnpm** as a package manager, but **yarn** and **npm** are also supported!</span>
  </div>
</div>

## Project setup

### Create a directory

First we create our project directory and initialize a new project inside

```sh
mkdir setup-starter
cd setup-starter
pnpm init
```

### Installing setup.ts

Next we will install **setup.ts** as a dev-dependency.

```sh
pnpm install -D @setup.ts/setup
```

### Running setup.ts

**@setup.ts/setup** ships with a useful CLI tool.
You can access it via `pnpm setup.ts ...` or `npx setup.ts ...` when using NPM.

There are two commands you should know:

    - **setup.ts generate**: Generates a `setup.ts` file with the content of `package.json`
    - **setup.ts run**: Compiles your your `setup.ts` file into a `package.json` file while applying all plugins etc.

### Getting a setup.ts file

In your project directory run:

```sh
pnpm setup.ts generate
```

This will create a `setup.ts` file in your project directory with the contents of your `package.json` file.

You should see that a `setup.ts` file has been created that should look something like this

```ts
import { defineSetup } from "@setup.ts/setup";

export default defineSetup({
  name: "setup-starter",
  version: "1.0.0",
  description: "",
  main: "index.js",
  scripts: {
    test: 'echo "Error: no test specified" && exit 1',
  },
  keywords: [],
  author: "",
  license: "ISC",
  dependencies: {
    "@setup.ts/setup": "...",
  },
});
```

## Closing Words

Now you are basically ready to go! You can now freely edit your `setup.ts` file and run `setup.ts run` to compile your project.

_Make sure to check out the docs for more advanced usage and plugins._
