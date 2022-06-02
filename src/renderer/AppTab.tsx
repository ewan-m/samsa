import "./AppTab.scss";
import { CSSProperties, FunctionComponent, useState } from "react";
import { useAtom } from "jotai";
import { App } from "./App";
import { Icon } from "./components/Icon";
import {
  draggingTabAtom,
  TabIdContext,
  tabsAtom,
  TabState,
} from "./state/tabs";
import { useAutoAnimate } from "./hooks/useAutoAnimate";

const rearrangeTabs = (
  tabs: { [tabId: string]: TabState },
  draggingTabId: string,
  landingTabId: string
): { [tabId: string]: TabState } => {
  const tabsList = Object.entries(tabs).map(([tabId, tabState]) => ({
    ...tabState,
    tabId,
  }));
  return Object.fromEntries(
    tabsList
      .filter(({ tabId }) => tabId !== draggingTabId)
      .reduce((accumulation, current) => {
        const draggingIndex = tabsList.findIndex(
          ({ tabId }) => draggingTabId === tabId
        );
        const landingIndex = tabsList.findIndex(
          ({ tabId }) => tabId === landingTabId
        );

        return current.tabId === landingTabId
          ? landingIndex < draggingIndex
            ? [...accumulation, tabsList[draggingIndex], tabsList[landingIndex]]
            : [...accumulation, tabsList[landingIndex], tabsList[draggingIndex]]
          : [...accumulation, current];
      }, [] as Array<{ tabId: string } & TabState>)
      .map(({ tabId, ...state }) => [tabId, state])
  );
};

export const AppTab: FunctionComponent<{
  tabId: string;
}> = ({ tabId }) => {
  const [tabs, setTabs] = useAtom(tabsAtom);

  const [draggingTab, setDraggingTab] = useAtom(draggingTabAtom);
  const [isDraggable, setIsDraggable] = useState(false);
  const animationContainer = useAutoAnimate<HTMLDivElement>();

  return (
    <TabIdContext.Provider value={tabId}>
      <div
        id={tabId}
        style={
          {
            width: "400px",
          } as CSSProperties
        }
        onDrop={() => {
          if (draggingTab === tabId) return;
          setTabs(rearrangeTabs(tabs, draggingTab, tabId));
        }}
        draggable={isDraggable}
        onDragStart={() => {
          setDraggingTab(tabId);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          return false;
        }}
        className="appTab"
      >
        <div ref={animationContainer} className="appTab__content">
          <div className="appTab__controls">
            <button
              onMouseEnter={() => {
                setIsDraggable(true);
              }}
              onMouseLeave={() => {
                setIsDraggable(false);
              }}
              className="appTab__control"
              style={{ cursor: "move" }}
            >
              <Icon>drag_indicator</Icon>
            </button>
            <button
              onClick={() => {
                const clonedTabs = JSON.parse(JSON.stringify(tabs));
                delete clonedTabs[tabId];
                setTabs(clonedTabs);
              }}
              className="appTab__control"
            >
              <Icon>close</Icon>
            </button>
          </div>
          <App />
        </div>
      </div>
    </TabIdContext.Provider>
  );
};
