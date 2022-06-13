import { TsupPluginConfig } from "@";
import { defineTemplate } from "@setup.ts/setup";

export default defineTemplate<TsupPluginConfig>((config) => {
  return `import { defineConfig } from "tsup";

export default defineConfig(${JSON.stringify(config.tsup ?? {}, null, 2)});
  `;
});
