import rimraf from "rimraf";
import process from "process";
import { distPath, releasePath, dllPath } from "../configs/webpack.paths";

const args = process.argv.slice(2);
const commandMap: Record<string, any> = {
  dist: distPath,
  release: releasePath,
  dll: dllPath,
};

args.forEach((x) => {
  const pathToRemove = commandMap[x];
  if (pathToRemove !== undefined) {
    rimraf.sync(pathToRemove);
  }
});
