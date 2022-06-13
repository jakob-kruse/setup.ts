import { describe, it, expect } from "vitest";
import { compileSetupFile } from "@/setup";

describe("Compilation", () => {
  describe("basic", () => {
    it("should compile sync", async () => {
      const fixturePath = "test/fixtures/compilation/basic.ts";
      const config = await compileSetupFile(fixturePath);

      expect(config).toMatchSnapshot();
    });
  });

  describe("plugins", () => {
    it("should deep merge with the plugin result", async () => {
      const fixturePath = "test/fixtures/compilation/plugin.ts";
      const config = await compileSetupFile(fixturePath);

      expect(config).toMatchSnapshot("plugin-deep-merge");
    });

    it("should be chaining plugins", async () => {
      const fixturePath = "test/fixtures/compilation/plugin-chaining.ts";
      const config = await compileSetupFile(fixturePath);

      expect(config).toMatchSnapshot("plugin-chaining");
    });
  });

  describe("validation", () => {
    it("should validate the package", async () => {
      const fixturePath = "test/fixtures/compilation/validate-package.ts";
      try {
        await compileSetupFile(fixturePath);
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error).toMatchSnapshot();
        return;
      }

      // Vitest does not like ZodErrors :( This should never be called
      expect(false, "No error thrown").toBeTruthy();
    });

    it("should not validate when validateConfig = false", async () => {
      const fixturePath = "test/fixtures/compilation/validate-package.ts";
      try {
        await compileSetupFile(fixturePath, {
          validateConfig: false,
        });
      } catch (error) {
        expect(
          false,
          "Error thrown. Even though validateConfig is false"
        ).toBeTruthy();
      }
    });
  });
});
