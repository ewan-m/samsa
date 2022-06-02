import { useAtom } from "jotai";
import { useContext } from "react";
import { TabIdContext, tabsAtom } from "renderer/state/tabs";

export const useOpenInNewTab = () => {
  const [tabs, setTabs] = useAtom(tabsAtom);

  const currentTabId = useContext(TabIdContext);

  return (initialPath: string) => {
    setTabs(
      Object.fromEntries(
        Object.entries(tabs).reduce(
          (accumulation, tab) => [
            ...accumulation,
            ...(tab[0] === currentTabId
              ? [
                  tab,
                  [
                    window.api.randomUUID(),
                    {
                      connection: tab[1].connection,
                      initialPath,
                    },
                  ],
                ]
              : [tab]),
          ],
          [] as any
        )
      )
    );
  };
};
