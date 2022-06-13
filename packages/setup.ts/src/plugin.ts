import { DefineSetupOptions } from "@/setup";
import { PackageJson } from "@/types/package-json";
import { MaybePromise } from "@/types/util";

export type SetupPluginBuilder = MaybePromise<Partial<PackageJson>>;

export type SetupPluginDefinition<TSetupPluginConfig> = (
  config: TSetupPluginConfig,
  options: DefineSetupOptions
) => SetupPluginBuilder;

export type SetupPlugin = (options: DefineSetupOptions) => SetupPluginBuilder;

export function definePlugin<TPluginConfig = unknown>(
  builder: SetupPluginDefinition<TPluginConfig>
): (config: TPluginConfig) => SetupPlugin {
  return (config: TPluginConfig) => (options: DefineSetupOptions) =>
    builder(config, options);
}
