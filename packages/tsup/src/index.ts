import { definePlugin } from "@setup.ts/setup";
import tsupConfigTemplate from "./tsup-config";
import type { Options as TsupOptions } from "tsup";

export type TsupPluginConfig = {
  tsup?: TsupOptions;
  tsupVersion?: string;
};

export const tsupPlugin = definePlugin<TsupPluginConfig>(({ config }) => {
  return {
    mergePackage: {
      devDependencies: {
        tsup: config.tsupVersion || "latest",
      },
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
