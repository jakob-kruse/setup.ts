import { definePlugin } from "@";
import { defineSetup } from "@/setup";
import { PackageDefinition } from "@/types/package-json";

export const basicSetup = (
  config: PackageDefinition = {
    name: "test-name",
    version: "1.0.0",
  }
) => defineSetup(config);

export const emptyPlugin = () => definePlugin(() => ({}))();
