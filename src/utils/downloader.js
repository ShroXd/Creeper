const { download } = require("electron-dl");

export async function downloader(param, mainWindow) {
  await download(mainWindow, param.url, {
    directory: param.dir,
    onStarted: started => {
      mainWindow.send("started-download", started);
    },
    onProgress: progress => {
      mainWindow.send("download-progress", progress);
    }
  });
}
