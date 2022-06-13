import { PackageJson } from "@/types/package-json";
import { MaybePromise } from "@/types/util";
import { join } from "path";
import { promises as fs } from "fs";

export type SetupPluginBuilderFn<TPluginConfig> = (
  context: SetupPluginBuilderContext<TPluginConfig>
) => SetupPluginResult<TPluginConfig>;

export type TemplateFn<TPluginConfig> = (
  config: TPluginConfig
) => MaybePromise<string>;

export type SetupPluginFile<TPluginConfig> = {
  template: TemplateFn<TPluginConfig>;
  outputPath: string;
};

export type SetupPluginResult<TPluginConfig> = {
  mergePackageJson?: Partial<PackageJson>;
  registerFiles?: SetupPluginFile<TPluginConfig>[];
} | void;

export type SetupPluginBuilderContext<TPluginConfig> = {
  registerFile: (file: SetupPluginFile<TPluginConfig>) => void;
  mergePackageJson: (config: Partial<PackageJson>) => void;
  config: TPluginConfig;
};

export class SetupPluginBuilder<TPluginConfig = unknown> {
  private actions: (() => MaybePromise<void>)[] = [];

  private packageJsonMerge: Partial<PackageJson> = {};
  constructor(
    private config: TPluginConfig = {} as TPluginConfig,
    private builderFn: SetupPluginBuilderFn<TPluginConfig>
  ) {}

  private queueAction(action: () => MaybePromise<void>) {
    this.actions.push(action.bind(this));
  }

  registerFile({ template, outputPath }: SetupPluginFile<TPluginConfig>) {
    this.queueAction(async () => {
      const fileContent = (await template(this.config)).trim();
      const filePath = join(process.cwd(), outputPath);

      await fs.writeFile(filePath, fileContent, "utf-8");
    });
  }

  mergePackageJson(mergeData: Partial<PackageJson>) {
    this.queueAction(() => {
      this.packageJsonMerge = Object.assign(this.packageJsonMerge, mergeData);
    });
  }

  public async build(): Promise<Partial<PackageJson>> {
    const builderContext: SetupPluginBuilderContext<TPluginConfig> = {
      registerFile: this.registerFile.bind(this),
      mergePackageJson: this.mergePackageJson.bind(this),
      // TODO: maybe clone
      config: this.config,
    };

    const builderResult = this.builderFn(builderContext);

    if (builderResult) {
      if (builderResult.mergePackageJson) {
        this.mergePackageJson(builderResult.mergePackageJson);
      }

      if (builderResult.registerFiles) {
        builderResult.registerFiles.forEach(this.registerFile.bind(this));
      }
    }

    await Promise.all(this.actions.map((action) => action()));

    return this.packageJsonMerge;
  }
}

export function defineTemplate<TPluginConfig = unknown>(
  templateFn: TemplateFn<TPluginConfig>
) {
  return (config: TPluginConfig) => {
    return templateFn(config);
  };
}

export function definePlugin<TPluginConfig = unknown>(
  builderFn: SetupPluginBuilderFn<TPluginConfig>
) {
  return (config?: TPluginConfig) => {
    return new SetupPluginBuilder<TPluginConfig>(config, builderFn);
  };
}
