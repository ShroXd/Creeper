const fs = require("fs");
const fsextra = require("fs-extra");
const path = require("path");
const exec = require("child_process").exec;
const compressing = require("compressing");
const node_ssh = require("node-ssh");

import { sendDeployInformation } from "./utils";

let SSH = new node_ssh();

export function cleanLocalOldFiles(config) {
  const dirs = fs.readdirSync(config.appBasePath);
  dirs.forEach(file => {
    if (file === config.appFileName) return;
    fsextra.removeSync(path.resolve(config.appBasePath, file));
  });
}

export function initializeServerFile(config) {
  sendDeployInformation("deploy-current-stage", "正在初始化应用");

  return new Promise((resolve, reject) => {
    const execString = `java -Xms${config.minMemory} -Xmx${config.maxMemory} -jar ${config.fileName}`;
    exec(
      execString,
      {
        cwd: config.filePath
      },
      err => {
        if (err) {
          console.error(`exec error: ${err}`);
          reject();
        }
        sendDeployInformation("deploy-finished-stage", "完成应用初始化");
        resolve();
      }
    );
  });
}

export function agreeEula(basePath) {
  const eulaPath = path.resolve(basePath, "eula.txt");
  const eula = fs.openSync(eulaPath, "w");
  fs.writeFileSync(eula, "eula=true", "utf8");
  fs.closeSync(eula);

  sendDeployInformation("deploy-finished-stage", "已同意 EULA 文件");
}

export function zipApplication(config) {
  sendDeployInformation("deploy-current-stage", "正在打包应用");

  return new Promise((resolve, reject) => {
    compressing.zip
      .compressDir(config.waitingForZip, config.zipResult)
      .then(() => {
        sendDeployInformation("deploy-finished-stage", "打包应用成功");
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
}

export function connectServer(loginInfo) {
  sendDeployInformation("deploy-current-stage", "正在连接服务器");

  return new Promise((resolve, reject) => {
    SSH.connect(loginInfo)
      .then(() => {
        sendDeployInformation("deploy-finished-stage", "连接服务器成功");
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
}

export async function uploadFile(config) {
  sendDeployInformation("deploy-current-stage", "正在上传文件至服务器");
  await SSH.putFiles([{ local: config.localPath, remote: config.remotePath }]);
  sendDeployInformation("deploy-finished-stage", "上传成功");
}

export async function unzipRemoteOldFiles(config) {
  sendDeployInformation("deploy-current-stage", "正在解压远程文件");
  await SSH.execCommand(`unzip application.zip && rm -f application.zip`, {
    cwd: config.remotePath
  });
  sendDeployInformation("deploy-finished-stage", "解压成功");
}
