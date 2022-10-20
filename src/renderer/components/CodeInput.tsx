import "./CodeInput.scss";
import { ChangeEventHandler, FunctionComponent } from "react";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-json";

export const CodeInput: FunctionComponent<{
  value: string;
  onChange: null | ChangeEventHandler<HTMLTextAreaElement>;
  language: "javascript" | "json";
}> = ({ value, onChange, language }) => {
  return (
    <div className="codeInput">
      {onChange && (
        <textarea
          spellCheck={false}
          className="codeInput__input"
          value={value}
          onChange={onChange}
        />
      )}
      <pre
        dangerouslySetInnerHTML={{
          __html: highlight(value, languages[language], language),
        }}
        aria-hidden={onChange !== null}
        className="codeInput__display"
      ></pre>
    </div>
  );
};
