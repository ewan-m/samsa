import { Theme, themeAtom, cssThemes } from "../state/theme";
import { useAtom } from "jotai";
import { BreadCrumbs } from "../components/BreadCrumbs";

export const Settings = () => {
  const [theme, setTheme] = useAtom(themeAtom);

  return (
    <div className="page">
      <BreadCrumbs />
      <h2 className="title nonshrinkContent">Settings</h2>
      <form className="shrinkContent">
        <label className="form__label">
          Theme
          <select
            className="form__input"
            value={theme}
            onChange={(e) => {
              setTheme(e.target.value as Theme);
            }}
          >
            {Object.keys(cssThemes).map((theme) => (
              <option key={theme}>{theme}</option>
            ))}
          </select>
        </label>
      </form>
    </div>
  );
};
