import path from "path";
import rimraf from "rimraf";
import { distMainPath, distRendererPath } from "../configs/webpack.paths";

export default function deleteSourceMaps() {
  [distMainPath, distRendererPath].forEach((subPath) =>
    rimraf.sync(path.join(subPath, "*.js.map"))
  );
}
