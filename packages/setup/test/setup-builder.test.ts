import { definePlugin } from "@";
import { SetupBuilder } from "@/setup";
import { PackageDefinition } from "@/types/package-json";
import { describe, expect, it } from "vitest";
import { basicSetup } from "./util";

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
      const setupBuilder = basicSetup();

      setupBuilder.mergeOptions({
        validatePackageJson: false,
      });

      expect(setupBuilder.getOptions().validatePackageJson).toBe(false);
    });
  });

  describe("fromFile()", () => {
    it("should compile a setup file", async () => {
      const fixturePath = "test/fixtures/basic.ts";

      const setupBuilder = await SetupBuilder.fromFile(fixturePath);

      expect(setupBuilder).toBeDefined();
      // TODO: Find out why this is not working. setupBuilder is not an instance of SetupBuilder
      // expect(setupBuilder).toBeInstanceOf(SetupBuilder);

      expect(await setupBuilder._build()).toMatchInlineSnapshot(`
        {
          "description": "test-desc",
          "name": "test-name",
          "version": "1.0.0",
        }
      `);
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

  describe("use()", () => {
    it("should add a plugin", async () => {
      const expectedDescription = "new description";
      const setupBuilder = basicSetup();
      const changeDescriptionPlugin = definePlugin(() => {
        return {
          mergePackage: {
            description: expectedDescription,
          },
        };
      });
      setupBuilder.use(changeDescriptionPlugin());

      const config = await setupBuilder._build();

      expect(config.description).toBe(expectedDescription);
    });

    it("should not change without plugins", async () => {
      const expectedConfig: PackageDefinition = {
        name: "test-name",
        version: "1.0.0",
      };

      const setupBuilder = basicSetup(expectedConfig);

      const config = await setupBuilder._build();

      expect(config).toBe(expectedConfig);
    });
  });
});
