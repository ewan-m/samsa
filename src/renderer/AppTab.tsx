import "./AppTab.scss";
import { CSSProperties, FunctionComponent, useState } from "react";
import { useAtom } from "jotai";
import { App } from "./App";
import { Icon } from "./components/Icon";
import { draggingTabAtom, tabsAtom } from "./state/tabs";
import { useAutoAnimate } from "./hooks/useAutoAnimate";

export const AppTab: FunctionComponent<{
  tabId: string;
}> = ({ tabId }) => {
  const [tabs, setTabs] = useAtom(tabsAtom);

  const [draggingId, setDraggingId] = useAtom(draggingTabAtom);
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
        if (draggingId === tabId) return;
        setTabs(
          tabs
            .filter((tab) => tab !== draggingId)
            .reduce(
              (accumulation, current) =>
                current === tabId
                  ? [...accumulation, draggingId, current]
                  : [...accumulation, current],
              [] as string[]
            )
        );
      }}
      draggable={isDraggable}
      onDragStart={() => {
        setDraggingId(tabId);
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
