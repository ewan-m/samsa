import "./AppTab.scss";
import { CSSProperties, FunctionComponent, useState } from "react";
import { useAtom } from "jotai";
import { App } from "./App";
import { Icon } from "./components/Icon";
import { draggingTabAtom, tabsAtom } from "./state/tabs";
import { useAutoAnimate } from "./hooks/useAutoAnimate";

const rearrangeTabs = (
  allTabs: string[],
  draggingTab: string,
  landingTab: string
) =>
  allTabs
    .filter((tab) => tab !== draggingTab)
    .reduce(
      (accumulation, current) =>
        current === landingTab
          ? allTabs.indexOf(landingTab) < allTabs.indexOf(draggingTab)
            ? [...accumulation, draggingTab, landingTab]
            : [...accumulation, landingTab, draggingTab]
          : [...accumulation, current],
      [] as string[]
    );

export const AppTab: FunctionComponent<{
  tabId: string;
}> = ({ tabId }) => {
  const [tabs, setTabs] = useAtom(tabsAtom);

  const [draggingTab, setDraggingTab] = useAtom(draggingTabAtom);
  const [isDraggable, setIsDraggable] = useState(false);
  const animationContainer = useAutoAnimate<HTMLDivElement>();

  return (
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
              setTabs(tabs.filter((id) => id !== tabId));
            }}
            className="appTab__control"
          >
            <Icon>close</Icon>
          </button>
        </div>
        <App />
      </div>
    </div>
  );
};
