import { DefineSetupOptions } from "@/setup";
import { PackageJson } from "@/types/package-json";
import { MaybePromise } from "@/types/util";

export type SetupPluginResult = MaybePromise<Partial<PackageJson>>;

export type SetupPluginDefinition<TSetupPluginConfig> = (
  config: TSetupPluginConfig,
  options: DefineSetupOptions
) => SetupPluginResult;

export type SetupPluginBuilder = (
  options: DefineSetupOptions
) => SetupPluginResult;

export function definePlugin<TPluginConfig = unknown>(
  builder: SetupPluginDefinition<TPluginConfig>
): (config?: TPluginConfig) => SetupPluginBuilder {
  return (config = {} as TPluginConfig) =>
    (options: DefineSetupOptions) =>
      builder(config, options);
}
