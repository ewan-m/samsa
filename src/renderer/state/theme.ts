import { atomWithStorage } from "jotai/utils";

export const cssThemes = {
  Light: "theme__defaultLight",
  Dark: "theme__defaultDark",
  Innovation: "theme__defaultDark theme__innovation",
  "The a11y Ally": "theme__monochrome",
};

export type Theme = keyof typeof cssThemes;
export const themeAtom = atomWithStorage<Theme>(
  "theme",
  window?.matchMedia?.("(prefers-color-scheme: dark)")?.matches
    ? "Dark"
    : "Light"
);
