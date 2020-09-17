const { download } = require("electron-dl");

export async function downloader(param, mainWindow) {
  console.log("开始下载");

  await download(mainWindow, param.url, {
    directory: param.dir,
    onProgress: progress => {
      mainWindow.send("download-progress", progress);
    }
  });

  mainWindow.send("download-finished");

  console.log("完成下载");
}
