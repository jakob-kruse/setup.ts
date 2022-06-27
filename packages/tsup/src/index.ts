import { definePlugin } from "@setup.ts/setup";
import tsupConfigTemplate from "./tsup-config";
import type { Options as TsupOptions } from "tsup";

export type TsupPluginConfig = {
  tsup?: TsupOptions;
  setup?: {
    tsupVersion?: string;
    configPath?: string;
  };
};

export const tsupPlugin = definePlugin<TsupPluginConfig>(({ config }) => {
  return {
    mergePackage: {
      devDependencies: {
        tsup: config.setup?.tsupVersion || "latest",
      },
    },
    registerFiles: [
      {
        outputPath: config.setup?.configPath || "tsup.config.ts",
        template: tsupConfigTemplate,
      },
    ],
  };
});

export default tsupPlugin;
