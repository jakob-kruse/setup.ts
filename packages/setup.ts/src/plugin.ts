import { DefineSetupOptions } from "@/setup";
import { PackageJson } from "@/types/package-json";
import { MaybePromise } from "@/types/util";

export type PluginBuilder = MaybePromise<Partial<PackageJson>>;

export type PluginDefinition<TPluginConfig> = (
  config: TPluginConfig,
  options: DefineSetupOptions
) => PluginBuilder;

export type Plugin = (options: DefineSetupOptions) => PluginBuilder;

export function definePlugin<TPluginConfig = unknown>(
  builder: PluginDefinition<TPluginConfig>
): (config: TPluginConfig) => Plugin {
  return (config: TPluginConfig) => (options: DefineSetupOptions) =>
    builder(config, options);
}
