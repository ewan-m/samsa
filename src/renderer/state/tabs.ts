import { atom } from "jotai";

type Tab = [tabId: string, isOpen: boolean];

export const tabsAtom = atom<Tab[]>([
  [window.api.randomUUID(), true],
  [window.api.randomUUID(), false],
]);

export const draggingTabAtom = atom("");
