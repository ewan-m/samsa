import "./index.scss";
import "./fonts/fonts.scss";
import "./pages/Page.scss";
import { createRoot } from "react-dom/client";
import { AppTab } from "./AppTab";
import { useAtom, useAtomValue } from "jotai";
import { tabsAtom } from "./state/tabs";
import { cssThemes, themeAtom } from "./state/theme";
import { useEffect, useState } from "react";
import { useTimeout } from "./hooks/useTimeout";
import { useAutoAnimate } from "./hooks/useAutoAnimate";
import { Icon } from "./components/Icon";

const App = () => {
  const [tabs, setTabs] = useAtom(tabsAtom);
  const theme = useAtomValue(themeAtom);

  const [themeClass, setThemeClass] = useState(cssThemes[theme]);

  useEffect(() => {
    setThemeClass(`${cssThemes[theme]} themeTransition`);
  }, [theme]);

  useTimeout(
    () => {
      setThemeClass(cssThemes[theme]);
    },
    300,
    [theme]
  );

  const animationContainer = useAutoAnimate<HTMLDivElement>();

  return (
    <div className={themeClass} style={{ height: "100%" }}>
      <div ref={animationContainer} id="appContainer" className="container">
        {tabs.map((tabId) => (
          <AppTab key={tabId} tabId={tabId} />
        ))}
        <button
          onClick={() => {
            setTabs([...tabs, window.api.randomUUID()]);
          }}
          className="newTabButton"
        >
          <Icon>add</Icon>
        </button>
      </div>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);
