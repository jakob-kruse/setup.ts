import { z } from "zod";
import { bundleRequire } from "bundle-require";
import { PackageJson } from "./types/package-json";
import type { Plugin, PluginBuilder } from "@/plugin";

const DefineSetupOptionsSchema = z
  .object({
    validateConfig: z.boolean().default(true).optional(),
    validateOptions: z.boolean().default(true).optional(),
  })
  .optional();

export type DefineSetupOptions = z.infer<typeof DefineSetupOptionsSchema>;

export class SetupBuilder {
  private pluginQueue: PluginBuilder[] = [];

  constructor(
    private readonly config: PackageJson,
    private readonly options?: DefineSetupOptions
  ) {}

  public add(plugin: Plugin) {
    this.pluginQueue.push(plugin(this.options));
    return this;
  }

  public async _build() {
    if (this.pluginQueue.length === 0) {
      return this.config;
    }

    const pluginChanges = await Promise.all(this.pluginQueue);

    let newConfig = structuredClone(this.config);

    for (const pluginChange of pluginChanges) {
      newConfig = Object.assign(newConfig, pluginChange);
    }

    return newConfig;
  }
}

export function defineSetup(
  config: PackageJson,
  options?: DefineSetupOptions
): SetupBuilder {
  return new SetupBuilder(config, options);
}

export async function compile(filePath: string) {
  const file = await bundleRequire({
    filepath: filePath,
  });

  if (!file.mod) {
    throw new Error("Could not import package.ts");
  }

  const setupBuilder: SetupBuilder = await file.mod.default;

  return setupBuilder._build();
}
