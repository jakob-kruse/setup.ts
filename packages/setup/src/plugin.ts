import { MaybePromise } from "@/types";
import { PackageDefinition } from "@/types/package-json";
import { promises as fs } from "fs";
import { join } from "path";
import {
  type Answers,
  type Options as PromptsOptions,
  type PromptObject,
} from "prompts";
/**
 * The function the plugin developer defines to build the package definition.
 */
export type SetupPluginBuilderFn<TPluginConfig> = (
  context: SetupPluginBuilderContext<TPluginConfig>
) => SetupPluginResult<TPluginConfig>;

/**
 * Returned by the plugin builder function.
 * Should be called by the plugin user with the desired options.
 */
export type SetupPluginFactory<TPluginConfig> = (
  config?: TPluginConfig
) => SetupPluginBuilder<TPluginConfig>;

/**
 * A function to create a file. Either read it from the file system or create a custom string.
 */
export type TemplateFn<TPluginConfig> = (
  config: TPluginConfig
) => MaybePromise<string>;

/**
 * Information about a file. Used when applying the plugin.
 */
export type SetupPluginFile<TPluginConfig> = {
  template: TemplateFn<TPluginConfig>;
  outputPath: string;
};

/**
 * Return type of {@link SetupPluginBuilderFn}. Could be void, when using the function syntax.
 */
export type SetupPluginResult<TPluginConfig> = void | {
  mergePackage?: Partial<PackageDefinition>;
  registerFiles?: SetupPluginFile<TPluginConfig>[];
};

/**
 * Context passed to the {@link SetupPluginBuilderFn}.
 */
export type SetupPluginBuilderContext<TPluginConfig> = {
  registerFile: (file: SetupPluginFile<TPluginConfig>) => void;
  mergePackage: (config: Partial<PackageDefinition>) => void;
  config: TPluginConfig;
};

export class SetupPluginBuilder<TPluginConfig = unknown> {
  /**
   * Queued actions like mergePackage or registerFile that could be async. This way the builder can be used synchronously
   */
  private actions: (() => MaybePromise<void>)[] = [];

  /**
   * The data to be merged with the package object when the build is done.
   */
  private packageJsonMerge: Partial<PackageDefinition> = {};

  constructor(
    private config: TPluginConfig = {} as TPluginConfig,
    private builderFn: SetupPluginBuilderFn<TPluginConfig>,
    private prompt?: ReturnType<typeof definePrompt>
  ) {}

  public getPrompt() {
    return this.prompt;
  }

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

  mergePackage(mergeData: Partial<PackageDefinition>) {
    this.queueAction(() => {
      this.packageJsonMerge = Object.assign(this.packageJsonMerge, mergeData);
    });
  }

  public async build(): Promise<Partial<PackageDefinition>> {
    const builderContext: SetupPluginBuilderContext<TPluginConfig> = {
      registerFile: this.registerFile.bind(this),
      mergePackage: this.mergePackage.bind(this),
      // TODO: maybe clone
      config: this.config,
    };

    const builderResult = this.builderFn(builderContext);

    if (builderResult) {
      if (builderResult.mergePackage) {
        this.mergePackage(builderResult.mergePackage);
      }

      if (builderResult.registerFiles) {
        builderResult.registerFiles.forEach(this.registerFile.bind(this));
      }
    }

    await Promise.all(this.actions.map((action) => action()));

    return this.packageJsonMerge;
  }
}

/**
 * @param templateFn - The template function to use
 * @returns A builder for a setup plugin
 */
export function defineTemplate<TPluginConfig = unknown>(
  templateFn: TemplateFn<TPluginConfig>
): TemplateFn<TPluginConfig> {
  return (config: TPluginConfig) => {
    return templateFn(config);
  };
}

/**
 * @param builderFn - The builder function to use. Should use function syntax or return changes.
 */
export function definePlugin<TPluginConfig = unknown>(
  builderFn: SetupPluginBuilderFn<TPluginConfig>,
  prompt?: ReturnType<typeof definePrompt>
): SetupPluginFactory<TPluginConfig> {
  return (config?: TPluginConfig) => {
    return new SetupPluginBuilder<TPluginConfig>(config, builderFn, prompt);
  };
}

export function definePrompt<TInput extends string = string>(
  prompt: PromptObject<TInput> | Array<PromptObject<TInput>>,
  transformer: (data: Answers<TInput>) => unknown,
  options?: PromptsOptions
) {
  return {
    prompt,
    transformer,
    options,
  };
}
