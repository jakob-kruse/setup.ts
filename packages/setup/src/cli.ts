#!/bin/env node

import cac from "cac";
import { SetupBuilder } from "@/setup";
import { promises as fs } from "fs";
import { join } from "path";

const cli = cac("setup.ts");

cli
  .command("run", "Compile setup.ts to package.json")
  .option("-p, --path <path>", "Path to setup.ts", {
    default: "setup.ts",
  })
  .option("-o, --out <path>", "Output for compiled package.json", {
    default: "package.json",
  })
  .action(async (options: { path: string; out: string }) => {
    const packageTsPath = join(process.cwd(), options.path);
    if (!(await fileExists(packageTsPath))) {
      console.log("No setup.ts found");
      return;
    }

    const setupBuilder = await SetupBuilder.fromFile(packageTsPath);
    const compiled = await setupBuilder._build();

    await fs.writeFile(
      join(process.cwd(), options.out),
      JSON.stringify(compiled, null, 2)
    );

    console.log(`Successfully wrote to ${options.out}`);
  });

cli
  .command("generate", "Generate a setup.ts from a package.json")
  .option("-p, --path <path>", "Path to package.json", {
    default: "package.json",
  })
  .option("-o, --out <path>", "Output for compiled setup.ts", {
    default: "setup.ts",
  })
  .action(async (options: { path: string; out: string }) => {
    const packageJsonPath = join(process.cwd(), options.path);
    if (!(await fileExists(packageJsonPath))) {
      console.log("No package.json found");
      return;
    }

    const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");

    const packageTsPath = join(process.cwd(), options.out);

    const template = (
      content: string
    ) => `import { defineSetup } from '@setup.ts/setup';

export default defineSetup(${content});`;

    await fs.writeFile(packageTsPath, template(packageJsonContent));

    console.log(`Successfully wrote to ${options.out}`);
  });

cli.parse();
cli.help();

async function fileExists(path: string): Promise<boolean> {
  try {
    const fileStat = await fs.stat(path);

    if (fileStat.isFile()) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
}
