import { definePlugin } from "@setup.ts/setup";
import tsupConfigTemplate from "./tsup-config";
import type { Options as TsupOptions } from "tsup";

export type TsupPluginConfig = {
  tsup?: TsupOptions;
};

export const tsupPlugin = definePlugin<TsupPluginConfig>(() => {
  return {
    mergePackageJson: {
      description: "new description of tsup",
    },
    registerFiles: [
      {
        outputPath: "tsup.config.ts",
        template: tsupConfigTemplate,
      },
    ],
  };
});

export default tsupPlugin;
