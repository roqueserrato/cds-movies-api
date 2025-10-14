import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "../../data");

export async function load(name) {
  try { return JSON.parse(await readFile(path.join(dataDir, `${name}.json`), "utf8")); }
  catch { return []; }
}
export async function save(name, data) {
  await writeFile(path.join(dataDir, `${name}.json`), JSON.stringify(data, null, 2));
}
