const { download } = require("electron-dl");

export async function downloader(param, mainWindow) {
  await download(mainWindow, param.url, {
    directory: param.dir,
    onProgress: progress => {
      mainWindow.send("download-progress", progress);
    }
  });
}
