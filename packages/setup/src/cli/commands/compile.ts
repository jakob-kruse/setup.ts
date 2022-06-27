import { SetupBuilder } from "@/setup";
import { fileExists } from "@/util";
import { promises as fs } from "fs";
import { join } from "path";

export async function compileSetup(options: { path: string; out: string }) {
  const packageTsPath = join(process.cwd(), options.path);
  if (!(await fileExists(packageTsPath))) {
    console.log("No setup.ts found");
    return;
  }

  const setupBuilder = await SetupBuilder.fromFile(packageTsPath);
  const compiled = await setupBuilder._build();

  await fs.writeFile(
    join(process.cwd(), options.out),
    JSON.stringify(compiled, null, 2)
  );

  console.log(`Successfully wrote to ${options.out}`);
}
