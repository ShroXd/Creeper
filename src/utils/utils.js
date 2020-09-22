import { isNumber } from "lodash";

export function normalizeFileSize(size) {
  if (!isNumber(size)) return size;
  return (size / (1024 * 1024)).toFixed(1);
}

export function normalizePercent(percent) {
  return percent.toFixed(1);
}
