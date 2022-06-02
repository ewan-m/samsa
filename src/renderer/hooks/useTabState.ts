import { useAtom } from "jotai";
import { useContext } from "react";
import { TabState, tabsAtom, TabIdContext } from "renderer/state/tabs";

export const useTabsState = (): [TabState, (newState: TabState) => void] => {
  const [tabs, setTabs] = useAtom(tabsAtom);
  const tabId = useContext(TabIdContext);

  const setState = (newState: TabState) => {
    const deepClone = JSON.parse(JSON.stringify(tabs));
    deepClone[tabId] = newState;
    setTabs(deepClone);
  };

  return [tabs[tabId], setState];
};
