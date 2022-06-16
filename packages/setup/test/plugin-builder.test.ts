import { definePlugin } from "@";
import { promises } from "fs";
import { join } from "path";
import { describe, expect, it, vi } from "vitest";
import { basicSetup } from "./util";

vi.mock("fs/promises", () => ({
  writeFile: vi.fn(),
}));
const writeFileSpy = vi
  .spyOn(promises, "writeFile")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .mockImplementation(async (_path, _content, _encoding) => {
    return;
  });

describe("PluginBuilder", () => {
  describe("definePlugin", () => {
    it("should be defined", () => {
      expect(definePlugin).toBeDefined();
    });
  });

  describe("functional syntax", () => {
    it("should merge options", async () => {
      const setup = basicSetup();
      const changeDescriptionPlugin = definePlugin(
        ({ mergePackage: mergePackageJson }) => {
          mergePackageJson({
            description: "functional hello!",
          });
        }
      );

      setup.use(changeDescriptionPlugin());

      const config = await setup._build();

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

      const outputPath = "test.txt";
      const templateContent = "hello!";
      const registerFilePlugin = definePlugin(({ registerFile }) => {
        registerFile({
          template() {
            return templateContent;
          },
          outputPath,
        });
      });

      setup.use(registerFilePlugin());

      const config = await setup._build();

      expect(writeFileSpy).toHaveBeenCalledWith(
        join(process.cwd(), outputPath),
        templateContent,
        "utf-8"
      );

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
          mergePackage: {
            description: "declarative hello!",
          },
        };
      });

      setup.use(changeDescriptionPlugin());

      const config = await setup._build();

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
