import { atomWithLocalStorage } from "./atomWithLocalStorage";

export const cssThemes = {
  Light: "theme__defaultLight",
  Dark: "theme__defaultDark",
  "Green wash": "theme__defaultLight theme__greenWash",
  Innovation: "theme__defaultDark theme__innovation",
  "Trans rights": "theme__defaultLight theme__transRights",
  Ukraine: "theme__defaultLight theme__ukraine",
  "Wicked purple": "theme__defaultLight theme__wickedPurple",
  "The a11y Ally": "theme__monochrome",
};

export type Theme = keyof typeof cssThemes;
export const themeAtom = atomWithLocalStorage<Theme>("theme", "Light");
