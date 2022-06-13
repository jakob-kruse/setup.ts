import { z } from "zod";
import { bundleRequire } from "bundle-require";
import { PackageJson, PackageJsonSchema } from "./types/package-json";
import { SetupPluginBuilder } from "@/plugin";
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
  mergePackageJson: (packageJson: Partial<PackageJson>) => SetupBuilder;
};

export type SetupBuilderInternal = SetupBuilderPublic & {
  build: () => Promise<PackageJson>;
  getOptions: () => DefineSetupOptions;
  fromFile: () => Promise<SetupBuilder>;
};

export class SetupBuilder {
  private plugins: Promise<Partial<PackageJson>>[] = [];

  constructor(
    private packageJson: PackageJson,
    private options: DefineSetupOptions = {}
  ) {}

  public getOptions(): DefineSetupOptions {
    return this.options;
  }

  public mergeOptions(options: Partial<DefineSetupOptions>): SetupBuilder {
    this.options = Object.assign(this.options, options);

    return this;
  }

  public mergePackageJson(packageJson: Partial<PackageJson>): SetupBuilder {
    this.packageJson = Object.assign(this.packageJson, packageJson);

    return this;
  }

  public add(plugin: SetupPluginBuilder): SetupBuilder {
    this.plugins.push(plugin.build());

    return this;
  }

  public async build(): Promise<PackageJson> {
    this.mergeOptions(DefineSetupOptionsSchema.parse(this.options));
    // this.mergeConfig({
    //   dependencies: {
    //     "@setup.ts/setup": "*",
    //   },
    // });

    if (this.options?.validateConfig) {
      PackageJsonSchema.parse(this.packageJson);
    }

    if (this.plugins.length === 0) {
      return this.packageJson;
    }

    const pluginChanges = await Promise.all(this.plugins);

    for (const pluginChange of pluginChanges) {
      this.mergePackageJson(pluginChange);
    }

    return this.packageJson;
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
