import path from "path"

export function resolvePath(filePath, fileName) {
  return path.resolve(filePath, fileName);
}
