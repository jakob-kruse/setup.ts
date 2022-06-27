import { SetupPluginBuilder } from "@/plugin";
import { PackageDefinition } from "@/types/package-json";
import { fileExists } from "@/util";
import { promises as fs } from "fs";
import { basename, join } from "path";
import prompts from "prompts";

const availablePlugins: {
  title: string;
  description?: string;
}[] = [
  {
    title: "tsup",
    description: "Compile typescript libaries",
  },
];

async function promptBasics(current: Partial<PackageDefinition>) {
  return await prompts([
    {
      name: "name",
      type: "text",
      message: "Project Name",
      initial: current.name ?? basename(process.cwd()),
    },
    {
      name: "version",
      type: "text",
      message: "Project Version",
      initial: current.version ?? "0.0.1",
    },
    {
      name: "setupts_version",
      type: "text",
      message: "Setup.ts Version",
      initial: "latest",
    },
  ]);
}

async function isPluginAvailable(pluginName: string) {
  try {
    await import(`@setup.ts/${pluginName}`);
    return true;
  } catch (error) {
    console.log(error);

    return false;
  }
}

async function addPluginPrompt(): Promise<string[]> {
  const { add } = await prompts({
    type: "confirm",
    name: "add",
    message: "Add plugins?",
  });
  const pluginAvailability: Record<string, boolean> = (
    await Promise.all(
      availablePlugins.map(async ({ title }) => {
        const available = await isPluginAvailable(title);
        return {
          title,
          available,
        };
      })
    )
  ).reduce(
    (acc, curr) => ({
      ...acc,
      [curr.title]: curr.available,
    }),
    {}
  );

  if (add) {
    const { plugins } = await prompts({
      type: "multiselect",
      name: "plugins",
      message: "Select plugins",
      choices: availablePlugins.map(({ title, description }) => ({
        title,
        value: title,
        description,
        disabled: !pluginAvailability[title],
      })),
    });

    return plugins;
  }

  return [];
}

export async function generateSetup(options: {
  path: string;
  out: string;
  initial: string;
}) {
  const imports = ["import { defineSetup } from '@setup.ts/setup';"];
  const pluginDefinitions: string[] = [];

  let result: Partial<PackageDefinition> = {};

  if (options.initial) {
    const packageJsonPath = join(process.cwd(), options.path);
    if (!(await fileExists(packageJsonPath))) {
      console.error("File to merge not found!");
      return;
    }

    const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");

    result = JSON.parse(packageJsonContent) as Partial<PackageDefinition>;

    console.log(`Loaded initial config from ${options.initial}`);
  }

  const basics = await promptBasics(result);

  result = Object.assign(result, {
    name: basics.name,
    version: basics.version,
    devDependencies: {
      "@setup.ts/setup": basics.setupts_version,
    },
  });

  const plugins = await addPluginPrompt();
  for (const pluginName of plugins) {
    let pluginModule;
    try {
      pluginModule = await import(`@setup.ts/${pluginName}`);
    } catch (error) {
      console.log(
        `Could not load plugin ${pluginName}. Install it via "pnpm install -D @setup.ts/${pluginName}"`
      );

      continue;
    }
    const pluginBuilder: SetupPluginBuilder = pluginModule.default.default();
    const prompt = pluginBuilder.getPrompt();

    if (prompt) {
      const userResults = await prompts(prompt.prompt);

      imports.push(`import ${pluginName} from '@setup.ts/${pluginName}';`);

      pluginDefinitions.push(
        `.use(${pluginName}(${JSON.stringify(
          prompt.transformer(userResults),
          null,
          2
        )}))`
      );
    }
  }

  await fs.writeFile(
    join(process.cwd(), options.out),
    `${imports.join(";\n")}

export default defineSetup(${JSON.stringify(
      result,
      null,
      2
    )})${pluginDefinitions.join("\n")};`
  );

  console.log(`Successfully wrote to ${options.out}`);
}
