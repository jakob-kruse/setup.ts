#!/bin/env node

import cac from "cac";
import { compileSetup } from "./commands/compile";
import { generateSetup } from "./commands/generate";

const cli = cac("setup.ts");

cli
  .command("run", "Compile setup.ts to package.json")
  .option("-p, --path <path>", "Path to setup.ts", {
    default: "setup.ts",
  })
  .option("-i, --initial [path]", "Path to package.json to merge with", {
    default: "",
  })
  .option("-o, --out <path>", "Output for compiled package.json", {
    default: "package.json",
  })
  .action(compileSetup);

cli
  .command("generate", "Generate a setup.ts from a package.json")
  .option("-p, --path <path>", "Path to package.json", {
    default: "package.json",
  })
  .option("-o, --out <path>", "Output for compiled setup.ts", {
    default: "setup.ts",
  })
  .action(generateSetup);

cli.help();
cli.parse();
