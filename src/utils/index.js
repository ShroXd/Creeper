import { dialog, ipcMain } from "electron";
import { win } from "../background";

import { connect } from "./ssh";
import { downloader } from "./downloader";
import { copy, mkdir } from "./fs";

ipcMain.on("connect", (e, param) => {
  connect(param, win);
});

ipcMain.on("download", (e, param) => {
  downloader(param, win).then(() => {
    win.send("download-finished");
    console.log("完成下载");
  });
});

ipcMain.on("move-file", (e, param) => {
  copy(param).then(() => {
    win.send("moveSuccess", `复制文件完成`);
  });
});

ipcMain.on("mkdir", (e, param) => {
  mkdir(param).then(() => {
    win.send("mkdirSuccess", `创建文件夹完成`);
  });
});

ipcMain.on("open-directory-dialog", () => {
  dialog
    .showOpenDialog({
      properties: ["openDirectory"]
    })
    .then(dir => {
      if (dir) {
        win.send("selected-dirname", dir);
      }
    });
});

ipcMain.on("open-jar-file-dialog", () => {
  dialog
    .showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Jar", extensions: ["jar"] }]
    })
    .then(files => {
      if (files) {
        win.send("selected-file", files);
      }
    });
});
