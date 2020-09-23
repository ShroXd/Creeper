const exec = require("child_process").exec;
import { win } from "../background";
const { NodeSSH } = require("node-ssh");
const compressing = require("compressing");

export function initializeServerFile(config) {
  const execString = `java -Xms${config.minMemory} -Xmx${config.maxMemory} -jar ${config.fileName}`;
  console.log(execString);

  exec(
    execString,
    {
      cwd: config.applicationCorePath
    },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      win.send("initialize-finish", stdout);
      console.error(`stderr: ${stderr}`);
    }
  );
}

export function zipApplication(config) {
  compressing.zip
    .compressDir(config.waitingForZip, config.ZipResult)
    .then(() => {
      win.send("deploy-finished-stage", "压缩应用成功");
    });
}

export function uploadFile(config) {
  // ssh 上传文件
  const ssh = new NodeSSH();
  ssh
    .connect({
      host: config.hostIP,
      port: config.hostPort,
      username: config.username,
      password: config.password
    })
    .then(() => {
      console.log("连接远程服务器成功");
      // 上传文件
      // TODO 处理远程文件地址
      ssh
        .putFile(config.zipResult, "/home/Shroud/testdeploy/1a14256771.zip")
        .then(res => {
          console.log(res);
          console.log("上传成功");
        })
        .catch(err => {
          console.log(err);
        });
    });
}
