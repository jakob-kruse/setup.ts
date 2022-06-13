import { z } from "zod";
import { bundleRequire } from "bundle-require";
import { PackageJson, PackageJsonSchema } from "./types/package-json";
import type { SetupPluginBuilder, SetupPluginResult } from "@/plugin";
import { promises as fs } from "fs";
import path from "path";

const DefineSetupOptionsSchema = z
  .object({
    validateConfig: z.boolean().default(true).or(z.undefined()),
  })
  .default({});

export type DefineSetupOptions = z.infer<typeof DefineSetupOptionsSchema>;

export type SetupBuilderPublic = {
  add: (plugin: SetupPluginBuilder) => SetupBuilder;
  mergeOptions: (options: Partial<DefineSetupOptions>) => SetupBuilder;
};

export type SetupBuilderInternal = SetupBuilderPublic & {
  compile: () => Promise<PackageJson>;
  getOptions: () => DefineSetupOptions;
};

export class SetupBuilder {
  private pluginQueue: SetupPluginResult[] = [];

  constructor(
    private readonly config: PackageJson,
    private options: DefineSetupOptions = {}
  ) {}

  public getOptions() {
    return this.options;
  }

  public mergeOptions(options: Partial<DefineSetupOptions>) {
    this.options = Object.assign(this.options, options);

    return this;
  }

  public add(plugin: SetupPluginBuilder) {
    this.pluginQueue.push(plugin(this.options));
    return this;
  }

  public async compile() {
    this.mergeOptions(DefineSetupOptionsSchema.parse(this.options));

    if (this.options?.validateConfig) {
      PackageJsonSchema.parse(this.config);
    }

    // No plugins, just return the config
    if (this.pluginQueue.length === 0) {
      return this.config;
    }

    const pluginChanges = await Promise.all(this.pluginQueue);

    let newConfig = this.config;

    for (const pluginChange of pluginChanges) {
      newConfig = Object.assign(newConfig, pluginChange);
    }

    return newConfig;
  }

  static async fromFile(filePath: string): Promise<SetupBuilder> {
    const resolved = path.resolve(filePath);
    try {
      const fileStat = await fs.stat(resolved);

      if (!fileStat.isFile()) {
        throw new Error(`"${resolved}" is not a file`);
      }
    } catch (error) {
      throw new Error(`"${resolved}" does not exist`);
    }

    const file = await bundleRequire({
      filepath: resolved,
    });

    if (!file.mod) {
      throw new Error(`Could not import "${resolved}"`);
    }

    if (!file.mod.default) {
      throw new Error(`"${resolved}" does not export a default`);
    }

    return await file.mod.default;
  }
}

export function defineSetup(config: PackageJson, options?: DefineSetupOptions) {
  return new SetupBuilder(config, options) as SetupBuilderPublic;
}
