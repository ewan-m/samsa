import { DependencyList, useEffect, useRef } from "react";

export const useTimeout = (
  callback: () => void,
  delay: number,
  deps: DependencyList = []
) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay < 1) {
      return;
    }

    const id = setTimeout(() => savedCallback.current(), delay);

    return () => clearTimeout(id);
  }, deps);
};
