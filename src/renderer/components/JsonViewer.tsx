import ReactJson from "@microlink/react-json-view";
import { useAtomValue } from "jotai";
import { FunctionComponent } from "react";
import { themeAtom } from "renderer/state/theme";

export const JsonViewer: FunctionComponent<{ json: object }> = ({ json }) => {
  const theme = useAtomValue(themeAtom);

  const isLight = theme === "Light" || theme === "The a11y Ally";

  return (
    <ReactJson
      iconStyle="circle"
      theme={isLight ? "rjv-default" : "twilight"}
      style={{ fontSize: 12 }}
      indentWidth={2}
      displayObjectSize={false}
      quotesOnKeys={false}
      src={json}
      displayDataTypes={false}
    />
  );
};
