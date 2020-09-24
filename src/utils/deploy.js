const exec = require("child_process").exec;
import { win } from "../background";
const compressing = require("compressing");
const path = require("path");
const fs = require("fs");
const dayjs = require("dayjs");
const node_ssh = require("node-ssh");

let SSH = new node_ssh();

export async function deployHandler(context) {
  console.log(context);
  const appBasePath = path.dirname(context.applicationCorePath);
  const appFileName = path.basename(context.applicationCorePath);
  const localZipAppPath = path.join(
    path.resolve(appBasePath, "../"),
    appBasePath.split("/").pop() + ".zip"
  );

  // 初始化应用
  try {
    //TODO 清理文件

    await initializeServerFile({
      minMemory: context.minMemory,
      maxMemory: context.maxMemory,
      filePath: appBasePath,
      fileName: appFileName
    });

    // 自动同意 eula
    agreeEula(path.dirname(context.applicationCorePath));

    // 压缩应用
    await zipApplication({
      waitingForZip: appBasePath,
      zipResult: localZipAppPath
    });

    // 连接服务器
    await connectServer({
      host: context.hostIP,
      port: context.hostPort,
      username: context.hostUser,
      password: context.hostPassword
    });

    // 上传文件
    await uploadFile({
      localPath: localZipAppPath,
      remotePath: context.remotePath
    });
  } catch (e) {
    sendDeployInformation("deploy-failure", e || "未知");
  }
}

function sendDeployInformation(event, log) {
  win.send(event, {
    log: log,
    time: dayjs().format("YYYY-MM-DD HH:mm:ss")
  });
}

function initializeServerFile(config) {
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

function agreeEula(basePath) {
  console.log(basePath);
  const eulaPath = path.resolve(basePath, "eula.txt");
  const eula = fs.openSync(eulaPath, "w");
  fs.writeFileSync(eula, "eula=true", "utf8");
  fs.closeSync(eula);

  sendDeployInformation("deploy-finished-stage", "已同意 EULA 文件");
}

function zipApplication(config) {
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

function connectServer(loginInfo) {
  sendDeployInformation("deploy-current-stage", "正在连接服务器");
  console.log(loginInfo);

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

async function uploadFile(config) {
  console.log(config);
  sendDeployInformation("deploy-current-stage", "正在上传文件至服务器");
  await SSH.putFiles([{ local: config.localPath, remote: config.remotePath }]);
  sendDeployInformation("deploy-finished-stage", "上传成功");
}
