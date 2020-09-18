const fsPromises = require("fs").promises;

export async function copy(path, mainWindow) {
  fsPromises.copyFile(path.oldPath, path.newPath).then(() => {
    mainWindow.send("moveSuccess", `复制文件完成`);
  });
}

export async function mkdir(path, mainWindow) {
  fsPromises.mkdir(path).then(() => {
    mainWindow.send("mkdirSuccess", `创建文件夹完成`);
  });
}
