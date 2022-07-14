import { Menu, BrowserWindow } from "electron";

const menuItems: Electron.MenuItemConstructorOptions[] = [
  { label: "Undo", accelerator: "CmdOrCtrl+Z", role: "undo" },
  { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", role: "redo" },
  { type: "separator" },
  { label: "Cut", accelerator: "CmdOrCtrl+X", role: "cut" },
  { label: "Copy", accelerator: "CmdOrCtrl+C", role: "copy" },
  { label: "Paste", accelerator: "CmdOrCtrl+V", role: "paste" },
  { label: "Select All", accelerator: "CmdOrCtrl+A", role: "selectAll" },
];

const getMenuItems = (
  mainWindow: BrowserWindow,
  x: number,
  y: number
): Electron.MenuItemConstructorOptions[] => {
  if (
    process.env.NODE_ENV === "development" ||
    process.env.DEBUG_PROD === "true"
  ) {
    return [
      ...menuItems,
      { type: "separator" },
      {
        label: "Inspect element",
        click: () => {
          mainWindow.webContents.inspectElement(x, y);
        },
      },
    ];
  }
  return menuItems;
};

export const configureMenu = (mainWindow: BrowserWindow) => {
  mainWindow.setMenu(null);

  mainWindow.webContents.on("context-menu", (_, props) => {
    const { x, y } = props;

    Menu.buildFromTemplate(getMenuItems(mainWindow, x, y)).popup({
      window: mainWindow,
    });
  });
};
