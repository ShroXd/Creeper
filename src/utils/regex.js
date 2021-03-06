export const regex = {
  ip: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
  port: /^[1-9]\d{0,4}$/,
  file: /([^\\/]+)\.([^\\/]+)/,
  coreType: /.*-/,
  coreVersion: /-.*\.jar$/
};
