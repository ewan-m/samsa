import { Menu, BrowserWindow } from "electron";

export const configureMenu = (mainWindow: BrowserWindow) => {
  mainWindow.setMenu(null);

  if (
    process.env.NODE_ENV === "development" ||
    process.env.DEBUG_PROD === "true"
  ) {
    mainWindow.webContents.on("context-menu", (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: "Inspect element",
          click: () => {
            mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: mainWindow });
    });
  }
};
