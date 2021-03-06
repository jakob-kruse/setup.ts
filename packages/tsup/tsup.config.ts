import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  minify: !options.watch,
  splitting: false,
  dts: true,
  sourcemap: true,
  clean: true,
}));
