const node_ssh = require("node-ssh");

let SSH = new node_ssh();

export function connect(param, mainWindow) {
  return new Promise((resolve, reject) => {
    mainWindow.send("connect", `正在连接服务器`);
    SSH.connect({
      host: param.hostIP,
      port: param.hostPort,
      username: param.hostUser,
      password: param.hostPassword
    })
      .then(() => {
        mainWindow.send("connect", `连接服务器成功`);
        resolve();
      })
      .catch(() => {
        mainWindow.send("connect", `连接服务器失败`);
        reject();
      });
  });
}
