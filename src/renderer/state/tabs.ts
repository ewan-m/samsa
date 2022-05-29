import { atom } from "jotai";

export const tabsAtom = atom<string[]>([window.api.randomUUID()]);

export const draggingTabAtom = atom("");
