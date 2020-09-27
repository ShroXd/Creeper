import { win } from "../background";
const dayjs = require("dayjs");
const path = require("path");

export function generateMiddleware(fn, param, isSync = true) {
  return {
    fn: fn,
    param: param,
    isSync: isSync
  };
}

export function sendDeployInformation(event, log) {
  win.send(event, {
    log: log,
    time: dayjs().format("YYYY-MM-DD HH:mm:ss")
  });
}

export function preResolvePath(context) {
  const jarFilePath =
    context.type === "core"
      ? context.applicationCorePath
      : context.packageJarPath;

  const appBasePath = path.dirname(jarFilePath);
  const appFileName = path.basename(jarFilePath);
  const localZipAppName = appBasePath.split("/").pop() + ".zip";
  const localZipAppPath = path.join(
    path.resolve(appBasePath, "../"),
    localZipAppName
  );

  return [appBasePath, appFileName, localZipAppName, localZipAppPath];
}
