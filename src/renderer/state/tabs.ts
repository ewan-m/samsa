import { atom } from "jotai";
import { createContext } from "react";

export type TabState = {
  connection: string;
  initialPath: string | null;
};

export const tabsAtom = atom<{ [tabId: string]: TabState }>({
  [window.api.randomUUID()]: {
    initialPath: null,
    connection: "",
  },
});

export const draggingTabAtom = atom("");

export const TabIdContext = createContext("");
