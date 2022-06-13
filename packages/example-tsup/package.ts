import { defineSetup } from "@setup.ts/setup";
import { tsupPlugin } from "@setup.ts/tsup";

export default defineSetup({
  name: "example-tsup",
  version: "1.0.0",
  description: "",
  scripts: {},
  keywords: [],
  author: "",
  license: "ISC",
  devDependencies: {
    "@setup.ts/setup": "workspace:*",
    "@setup.ts/tsup": "workspace:*",
    tsup: "^6.1.2",
  },
}).add(
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
