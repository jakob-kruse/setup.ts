import { z } from "zod";
import { bundleRequire } from "bundle-require";
import { PackageJson, PackageJsonSchema } from "./types/package-json";
import type { SetupPlugin, SetupPluginBuilder } from "@/plugin";

const DefineSetupOptionsSchema = z
  .object({
    validateConfig: z.boolean().default(true).or(z.undefined()),
  })
  .default({});

export type DefineSetupOptions = z.infer<typeof DefineSetupOptionsSchema>;

export type SetupBuilderPublic = {
  add: (plugin: SetupPlugin) => SetupBuilder;
  mergeOptions: (options: Partial<DefineSetupOptions>) => SetupBuilder;
};

export type SetupBuilderInternal = SetupBuilderPublic & {
  compile: () => Promise<PackageJson>;
};

export class SetupBuilder {
  private pluginQueue: SetupPluginBuilder[] = [];

  constructor(
    private readonly config: PackageJson,
    private options: DefineSetupOptions = {}
  ) {}

  public mergeOptions(options: Partial<DefineSetupOptions>) {
    this.options = Object.assign(this.options, options);

    return this;
  }

  public add(plugin: SetupPlugin) {
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
}

export function defineSetup(config: PackageJson, options?: DefineSetupOptions) {
  return new SetupBuilder(config, options) as SetupBuilderPublic;
}

export async function compileSetupFile(
  filePath: string,
  mergeOptions?: Partial<DefineSetupOptions>
) {
  const file = await bundleRequire({
    filepath: filePath,
  });

  if (!file.mod) {
    throw new Error("Could not import package.ts");
  }

  const setupBuilder: SetupBuilderInternal = await file.mod.default;

  if (mergeOptions) {
    setupBuilder.mergeOptions(mergeOptions);
  }

  return setupBuilder.compile();
}
