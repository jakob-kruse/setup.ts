import { defineSetup } from "@setup.ts/setup";
import { tsupPlugin } from "@setup.ts/tsup";

export default defineSetup({
  name: "setup.ts-example-tsup",
  version: "1.0.0",
  description: "",
  main: "index.js",
  scripts: {},
  keywords: [],
  author: "",
  license: "ISC",
  devDependencies: {
    "@setup.ts/setup": "^0.0.1",
  },
}).use(
  tsupPlugin({
    tsup: {
      entry: ["src/index.ts"],
      splitting: false,
      dts: true,
      sourcemap: true,
      clean: true,
    },
  })
);
