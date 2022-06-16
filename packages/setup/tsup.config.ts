import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts", "src/cli.ts"],
  minify: !options.watch,
  splitting: false,
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
}));
