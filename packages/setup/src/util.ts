import { promises as fs } from "fs";

export async function fileExists(path: string): Promise<boolean> {
  try {
    const fileStat = await fs.stat(path);

    if (fileStat.isFile()) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
}