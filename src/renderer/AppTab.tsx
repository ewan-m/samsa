import "./AppTab.scss";
import { CSSProperties, FunctionComponent, useState } from "react";
import { useAtom } from "jotai";
import { useTimeout } from "./hooks/useTimeout";
import { App } from "./App";
import { Icon } from "./components/Icon";
import { draggingTabAtom, tabsAtom } from "./state/tabs";

export const AppTab: FunctionComponent<{
  tabId: string;
  isActive: boolean;
}> = ({ tabId, isActive }) => {
  const [tabs, setTabs] = useAtom(tabsAtom);
  const [withTransitions, setWithTransitions] = useState("appTab--transitions");

  useTimeout(
    () => {
      document.getElementById(tabId)?.scrollIntoView({ behavior: "smooth" });
      if (isActive) {
        setWithTransitions("");
      }
    },
    300,
    [isActive]
  );

  const [draggingId, setDraggingId] = useAtom(draggingTabAtom);
  const [isDraggable, setIsDraggable] = useState(false);

  return (
    <div
      id={tabId}
      style={
        {
          "--animation-delay": isActive ? 2 : 6,
          width: "400px",
        } as CSSProperties
      }
      onClick={() => {
        if (!isActive) {
          setTabs([
            ...tabs.map(([id, active]) => [id, tabId === id ? true : active]),
            [window.api.randomUUID(), false],
          ] as [string, boolean][]);
        }
      }}
      onDrop={() => {
        if (draggingId === tabId) return;
        setTabs(
          tabs
            .filter((tab) => tab[0] !== draggingId)
            .reduce(
              (accumulation, current): [string, boolean][] =>
                current[0] === tabId
                  ? [...accumulation, [draggingId, true], current]
                  : [...accumulation, current],

              [] as [string, boolean][]
            )
        );
      }}
      draggable={isActive && isDraggable}
      onDragStart={() => {
        setDraggingId(tabId);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        return false;
      }}
      role={isActive ? "region" : "button"}
      className={`contentAppear appTab appTab--${
        isActive ? "" : "in"
      }active ${withTransitions}`}
    >
      {!isActive && <Icon>add</Icon>}
      {isActive && (
        <div
          className="tabContent contentAppear"
          style={{ "--animation-delay": 2 } as CSSProperties}
        >
          <div className="tabControls">
            <button
              onMouseEnter={() => {
                setIsDraggable(true);
              }}
              onMouseLeave={() => {
                setIsDraggable(false);
              }}
              className="tabControlButton"
              style={{ cursor: "move" }}
            >
              <Icon>drag_indicator</Icon>
            </button>
            <button
              onClick={() => {
                setTabs(tabs.filter(([id]) => id !== tabId));
              }}
              className="tabControlButton"
            >
              <Icon>close</Icon>
            </button>
          </div>
          <App />
        </div>
      )}
    </div>
  );
};
