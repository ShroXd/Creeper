const path = require("path");

export function resolvePath(filePath, fileName) {
  return path.resolve(filePath, fileName);
}
