import { SetupPluginBuilder } from "@/plugin";
import {
  PackageDefinition,
  PackageDefinitionSchema,
} from "@/types/package-json";
import { bundleRequire } from "bundle-require";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";

const SetupOptionsSchema = z
  .object({
    validatePackageJson: z.boolean().default(true).or(z.undefined()),
  })
  .default({});

export type SetupBuilderOptions = z.infer<typeof SetupOptionsSchema>;

export class SetupBuilder {
  /**
   * Plugins to apply to the package definition
   */
  private plugins: Promise<Partial<PackageDefinition>>[] = [];

  constructor(
    private packageDefinition: PackageDefinition,
    private options: SetupBuilderOptions = {}
  ) {}

  public getOptions(): SetupBuilderOptions {
    return this.options;
  }

  public mergeOptions(options: Partial<SetupBuilderOptions>): this {
    this.options = Object.assign(this.options, options);

    return this;
  }

  public mergePackage(packageJson: Partial<PackageDefinition>): this {
    this.packageDefinition = Object.assign(this.packageDefinition, packageJson);

    return this;
  }

  /**
   * Use a plugin to modify the package definition.
   *
   * @param plugin - The plugin to apply to the package definition
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public use(plugin: any): this {
    this.plugins.push((plugin as SetupPluginBuilder).build());

    return this;
  }

  /**
   * @internal - Do not use this method.
   *
   * Builds the package definition.
   *
   * @returns The built package definition with all plugins applied
   */
  public async _build(): Promise<PackageDefinition> {
    this.mergeOptions(SetupOptionsSchema.parse(this.options));

    if (this.options?.validatePackageJson) {
      await PackageDefinitionSchema.parseAsync(this.packageDefinition);
    }

    if (this.plugins.length === 0) {
      return this.packageDefinition;
    }

    const pluginChanges = await Promise.all(this.plugins);

    for (const pluginChange of pluginChanges) {
      this.mergePackage(pluginChange);
    }

    return this.packageDefinition;
  }

  /**
   * @internal - Do not use this method.
   * @returns A SetupBuilder
   */
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

/**
 * Define a project setup.
 *
 * @param packageDefinition - The package.json data.
 * @param options - The options to define the setup.
 * @returns The setup builder.
 */
export function defineSetup(
  packageDefinition: PackageDefinition,
  options?: SetupBuilderOptions
): SetupBuilder {
  return new SetupBuilder(packageDefinition, options);
}
