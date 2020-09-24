import { win } from "../background";
const dayjs = require("dayjs");

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
