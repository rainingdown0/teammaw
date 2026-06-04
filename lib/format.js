import { readFileSync } from "fs";
import path from "path";

export function getFormat(id) {
  try {
    const file = path.join(process.cwd(), "data/formats", `${id}.json`);
    const format = JSON.parse(readFileSync(file, "utf-8"));
    return format.name;
  } catch {
    return id; // fallback to raw id if file not found
  }
}
