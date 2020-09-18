const fsPromises = require("fs").promises;

export async function copy(path) {
  await fsPromises.copyFile(path.oldPath, path.newPath);
}

export async function mkdir(path) {
  await fsPromises.mkdir(path);
}
