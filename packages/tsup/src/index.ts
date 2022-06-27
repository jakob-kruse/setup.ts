import { definePlugin, definePrompt } from "@setup.ts/setup";
import tsupConfigTemplate from "./tsup-config";
import type { Options as TsupOptions } from "tsup";

export type TsupPluginConfig = {
  tsup?: TsupOptions;
  setup?: {
    tsupVersion?: string;
    configPath?: string;
  };
};

const prompt = definePrompt(
  [
    {
      type: "text",
      message: "Tsup Config Location",
      name: "configPath",
      initial: "tsup.config.ts",
    },
    {
      type: "text",
      message: "Tsup version",
      name: "version",
      initial: "latest",
    },
  ],
  (data) =>
    ({
      setup: {
        configPath: data.configPath,
        tsupVersion: data.version,
      },
    } as TsupPluginConfig)
);

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
}, prompt);

export default tsupPlugin;
