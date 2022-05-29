import { atom } from "jotai";

export const atomWithLocalStorage = <T>(key: string, initialValue: T) => {
  const getInitialValue = () => {
    const item = localStorage.getItem(key);
    if (item !== null) {
      try {
        return JSON.parse(item);
      } catch (_) {}
    }
    return initialValue;
  };
  const baseAtom = atom(getInitialValue());
  const derivedAtom = atom<T, ((t: T) => T) | T, void>(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === "function"
          ? (update as (t: T) => T)(get(baseAtom))
          : update;
      set(baseAtom, nextValue);
      localStorage.setItem(key, JSON.stringify(nextValue));
    }
  );
  return derivedAtom;
};
