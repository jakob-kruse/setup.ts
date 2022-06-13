import { definePlugin } from "@";
import { SetupBuilder, SetupBuilderInternal } from "@/setup";
import { PackageJson } from "@/types/package-json";
import { describe, expect, it } from "vitest";
import { basicSetup, emptyPlugin } from "./util";

describe("SetupBuilder", () => {
  describe("defineSetup()", () => {
    it("should return a SetupBuilder Instance", () => {
      const setupBuilder = basicSetup();

      expect(setupBuilder).toBeDefined();
      expect(setupBuilder).toBeInstanceOf(SetupBuilder);
    });
  });

  describe("mergeOptions()", () => {
    it("should (deep) merge existing options with the provided", async () => {
      const setupBuilder = basicSetup() as SetupBuilderInternal;

      setupBuilder.mergeOptions({
        validateConfig: false,
      });

      expect(setupBuilder.getOptions().validateConfig).toBe(false);
    });
  });

  describe("fromFile()", () => {
    it("should compile a setup file", async () => {
      const fixturePath = "test/fixtures/basic.ts";

      const setupBuilder = await SetupBuilder.fromFile(fixturePath);

      expect(setupBuilder).toBeDefined();
      // TODO: Find out why this is not working. setupBuilder is not an instance of SetupBuilder
      //   expect(setupBuilder).toBeInstanceOf(SetupBuilder);
    });

    it("should throw an error if the file does not exist", async () => {
      const fixturePath = "test/fixtures/invalid/path.ts";

      expect(SetupBuilder.fromFile(fixturePath)).rejects.toThrow(
        /does not exist/
      );
    });

    it("should throw if the path is not a file", async () => {
      const fixturePath = "test/fixtures/invalid/not-file.ts";

      expect(SetupBuilder.fromFile(fixturePath)).rejects.toThrow(
        /does not exist/
      );
    });

    it("should throw with invalid syntax", async () => {
      const fixturePath = "test/fixtures/invalid/syntax";

      expect(SetupBuilder.fromFile(fixturePath)).rejects.toThrow(
        /is not a valid JS file/
      );
    });

    it("should throw if there is no default export", async () => {
      const fixturePath = "test/fixtures/invalid/default-export.ts";
      expect(SetupBuilder.fromFile(fixturePath)).rejects.toThrow(
        /Setup file does not export a default/
      );
    });
  });

  describe("add()", () => {
    it("should add a plugin", async () => {
      const expectedDescription = "new description";
      const setupBuilder = basicSetup();
      const changeDescriptionPlugin = definePlugin(() => ({
        description: expectedDescription,
      }));
      setupBuilder.add(changeDescriptionPlugin());

      const config = await setupBuilder.compile();

      expect(config.description).toBe(expectedDescription);
    });

    it("should not change without plugins", async () => {
      const expectedConfig: PackageJson = {
        name: "test-name",
        version: "1.0.0",
      };

      const setupBuilder = basicSetup(expectedConfig);

      const config = await setupBuilder.compile();

      expect(config).toBe(expectedConfig);
    });
  });
});
