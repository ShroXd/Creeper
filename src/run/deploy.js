const path = require("path");

import {
  generateMiddleware,
  sendDeployInformation,
  preResolvePath
} from "./utils";
import {
  cleanLocalOldFiles,
  // cleanRemoteOldFiles,
  initializeServerFile,
  addMods,
  agreeEula,
  zipApplication,
  connectServer,
  uploadFile,
  unzipRemoteOldFiles
} from "./handle";

let middleware = [];

export async function deployHandler(context, mods) {
  // 初始化处理链
  middlewareFactory(context, mods);

  // 执行处理链
  try {
    for (let handler of middleware) {
      await handler.fn(handler.param);
    }
    sendDeployInformation("deploy-success", "部署成功");
  } catch (e) {
    sendDeployInformation("deploy-failure", e || "未知");
  }
}

function middlewareFactory(context, mods) {
  const [
    appBasePath,
    appFileName,
    localZipAppName,
    localZipAppPath
  ] = preResolvePath(context);

  console.log("appBasePath: " + appBasePath);
  console.log("appFileName: " + appFileName);
  console.log("localZipAppName: " + localZipAppName);
  console.log("localZipAppPath: " + localZipAppPath);
  console.log(mods);
  switch (context.type) {
    case "core":
      initializeCoreDeployMiddleware(
        context,
        mods,
        appBasePath,
        appFileName,
        localZipAppName,
        localZipAppPath
      );
      break;
    case "package":
      initializePackageDeployMiddleware(
        context,
        mods,
        appBasePath,
        localZipAppPath
      );
      break;
    default:
      sendDeployInformation("deploy-failure", "暂不支持部署");
      break;
  }
}

function initializeCoreDeployMiddleware(
  context,
  mods,
  appBasePath,
  appFileName,
  localZipAppName,
  localZipAppPath
) {
  middleware.push(
    generateMiddleware(cleanLocalOldFiles, {
      appBasePath: appBasePath,
      appFileName: appFileName
    })
  );

  middleware.push(
    generateMiddleware(initializeServerFile, {
      minMemory: context.minMemory,
      maxMemory: context.maxMemory,
      filePath: appBasePath,
      fileName: appFileName
    })
  );

  serverProcessing(appBasePath, mods);

  middleware.push(
    generateMiddleware(zipApplication, {
      waitingForZip: appBasePath,
      zipResult: localZipAppPath
    })
  );

  uploadServer(context, localZipAppPath);

  middleware.push(
    generateMiddleware(unzipRemoteOldFiles, {
      remoteDir: path.dirname(context.remotePath)
    })
  );
}

function initializePackageDeployMiddleware(
  context,
  mods,
  appBasePath,
  localZipAppPath
) {
  serverProcessing(appBasePath, mods);

  middleware.push(
    generateMiddleware(zipApplication, {
      waitingForZip: appBasePath,
      zipResult: localZipAppPath
    })
  );

  uploadServer(context, localZipAppPath);

  middleware.push(
    generateMiddleware(unzipRemoteOldFiles, {
      remoteDir: path.dirname(context.remotePath)
    })
  );
}

function serverProcessing(appBasePath, mods) {
  middleware.push(
    generateMiddleware(addMods, {
      appBasePath: appBasePath,
      mods: mods
    })
  );

  middleware.push(generateMiddleware(agreeEula, appBasePath));
}

function uploadServer(context, localZipAppPath) {
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
