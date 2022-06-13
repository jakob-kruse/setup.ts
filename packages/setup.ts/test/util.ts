import { definePlugin } from "@";
import { defineSetup, SetupBuilder } from "@/setup";
import { PackageJson } from "@/types/package-json";

export const basicSetup = (
  config: PackageJson = {
    name: "test-name",
    version: "1.0.0",
  }
) => defineSetup(config) as SetupBuilder;

export const emptyPlugin = () => definePlugin(() => ({}))();
