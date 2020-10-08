import fs from "fs";
import * as fsextra from "fs-extra";
import path from "path";
import exec from "child_process";
import compressing from "compressing";
import node_ssh from "node-ssh";

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
          sendDeployInformation("deploy-failure", err);
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

export function addMods(config) {
  if (config.mods.length === 0) {
    sendDeployInformation("deploy-finished-stage", "无模组需要添加");
  }

  const basePath = path.join(config.appBasePath, "mods", "mcmd-mods");
  config.mods.forEach(mod => {
    const modFileName = path.basename(mod.modFilePath);

    const targetPath = path.resolve(basePath, modFileName);
    fsextra.copySync(mod.modFilePath, targetPath);
  });

  sendDeployInformation("deploy-finished-stage", "添加模组成功");
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
  await SSH.execCommand(`unzip -o application.zip && rm application.zip`, {
    cwd: config.remoteDir
  });
  sendDeployInformation("deploy-finished-stage", "解压成功");
}

export async function runClient(config) {
  await SSH.exec(`java -Xmx1G -Xms1G -jar ${config.clientJarFileName}`, [""], {
    cwd: config.remoteClientPath,
    onStdout(out) {
      sendDeployInformation("terminal-log", out);
    },
    onStdErr(err) {
      sendDeployInformation("terminal-log", err);
    }
  });
}
