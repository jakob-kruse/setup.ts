import { defineSetup } from "@setup.ts/setup";

export default defineSetup({
  name: "basic",
  version: "1.0.0",
  description: "",
  main: "index.js",
  scripts: {
    start: `setup.ts was ran at ${new Date().toLocaleTimeString()}`,
  },
  keywords: [],
  author: "",
  license: "ISC",
  devDependencies: {
    "@setup.ts/setup": "^0.0.1",
  },
});
