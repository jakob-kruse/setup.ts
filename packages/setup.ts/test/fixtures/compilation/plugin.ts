import { defineSetup, definePlugin } from "@";

const changeVersion = definePlugin<{ version: string }>((config) => ({
  version: config.version,
}));

export default defineSetup({
  name: "test-name",
  description: "test-desc",
  version: "1.0.0",
}).add(changeVersion({ version: "1.1.2" }));
