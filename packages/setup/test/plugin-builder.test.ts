import { definePlugin } from "@";
import { describe, it, expect } from "vitest";
import { basicSetup } from "./util";

describe("PluginBuilder", () => {
  describe("definePlugin", () => {
    it("should be defined", () => {
      expect(definePlugin).toBeDefined();
    });
  });

  describe("functional syntax", () => {
    it("should merge options", async () => {
      const setup = basicSetup();
      const changeDescriptionPlugin = definePlugin(({ mergePackageJson }) => {
        mergePackageJson({
          description: "functional hello!",
        });
      });

      setup.add(changeDescriptionPlugin());

      const config = await setup.build();

      expect(config).toMatchInlineSnapshot(`
        {
          "description": "functional hello!",
          "name": "test-name",
          "version": "1.0.0",
        }
      `);
    });

    it("should register files", async () => {
      const setup = basicSetup();
      const registerFilePlugin = definePlugin(({ registerFile }) => {
        registerFile({
          template() {
            return "hello!";
          },
          outputPath: "test.txt",
        });
      });

      setup.add(registerFilePlugin());

      const config = await setup.build();

      expect(config).toMatchInlineSnapshot(`
        {
          "name": "test-name",
          "version": "1.0.0",
        }
      `);
    });
  });

  describe("declarative syntax", () => {
    it("should merge options", async () => {
      const setup = basicSetup();
      const changeDescriptionPlugin = definePlugin(() => {
        return {
          mergePackageJson: {
            description: "declarative hello!",
          },
        };
      });

      setup.add(changeDescriptionPlugin());

      const config = await setup.build();

      expect(config).toMatchInlineSnapshot(`
        {
          "description": "declarative hello!",
          "name": "test-name",
          "version": "1.0.0",
        }
      `);
    });
  });
});
