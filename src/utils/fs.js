const fsPromises = require("fs").promises;

export async function copy(path) {
  await fsPromises.copyFile(path.oldPath, path.newPath);
}

export async function mkdir(path) {
  await fsPromises.mkdir(path);
}

export async function open(param) {
  return await fsPromises.readFile(
    param.scriptPath + "/" + param.scriptName + ".sh",
    {
      encoding: "utf-8",
      flag: "a+"
    }
  );
}

export async function save(param) {
  await fsPromises.writeFile(param.path, param.code);
}
