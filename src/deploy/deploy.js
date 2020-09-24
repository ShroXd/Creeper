const path = require("path");

import { generateMiddleware, sendDeployInformation } from "./utils";
import {
  initializeServerFile,
  agreeEula,
  zipApplication,
  connectServer,
  uploadFile
} from "./handle";

let middleware = [];

export async function deployHandler(context) {
  const appBasePath = path.dirname(context.applicationCorePath);
  const appFileName = path.basename(context.applicationCorePath);
  const localZipAppPath = path.join(
    path.resolve(appBasePath, "../"),
    appBasePath.split("/").pop() + ".zip"
  );

  // 初始化处理链
  // TODO 将初始化动态化
  initializeMiddleware(context, appBasePath, appFileName, localZipAppPath);

  // 执行处理链
  try {
    for (let handler of middleware) {
      if (handler.isSync) {
        await handler.fn(handler.param);
      } else {
        handler.fn(handler.param);
      }
    }
  } catch (e) {
    sendDeployInformation("deploy-failure", e || "未知");
  } finally {
    sendDeployInformation("deploy-success", "部署成功");
  }
}

function initializeMiddleware(
  context,
  appBasePath,
  appFileName,
  localZipAppPath
) {
  middleware.push(
    generateMiddleware(initializeServerFile, {
      minMemory: context.minMemory,
      maxMemory: context.maxMemory,
      filePath: appBasePath,
      fileName: appFileName
    })
  );

  middleware.push(
    generateMiddleware(
      agreeEula,
      path.dirname(context.applicationCorePath),
      false
    )
  );

  middleware.push(
    generateMiddleware(zipApplication, {
      waitingForZip: appBasePath,
      zipResult: localZipAppPath
    })
  );

  middleware.push(
    generateMiddleware(connectServer, {
      host: context.hostIP,
      port: context.hostPort,
      username: context.hostUser,
      password: context.hostPassword
    })
  );

  middleware.push(
    generateMiddleware(uploadFile, {
      localPath: localZipAppPath,
      remotePath: context.remotePath
    })
  );
}
