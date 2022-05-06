import fs from "fs";
import {
  srcNodeModulesPath,
  appNodeModulesPath,
} from "../configs/webpack.paths";

if (!fs.existsSync(srcNodeModulesPath) && fs.existsSync(appNodeModulesPath)) {
  fs.symlinkSync(appNodeModulesPath, srcNodeModulesPath, "junction");
}
