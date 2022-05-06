const path = require("path");

export const rootPath = path.join(__dirname, "../..");

export const dllPath = path.join(__dirname, "../dll");

export const srcPath = path.join(rootPath, "src");
export const srcMainPath = path.join(srcPath, "main");
export const srcRendererPath = path.join(srcPath, "renderer");

export const releasePath = path.join(rootPath, "release");
export const appPath = path.join(releasePath, "app");
export const appPackagePath = path.join(appPath, "package.json");
export const appNodeModulesPath = path.join(appPath, "node_modules");
export const srcNodeModulesPath = path.join(srcPath, "node_modules");

export const distPath = path.join(appPath, "dist");
export const distMainPath = path.join(distPath, "main");
export const distRendererPath = path.join(distPath, "renderer");

export const buildPath = path.join(releasePath, "build");
