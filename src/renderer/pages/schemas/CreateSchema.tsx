import { useState } from "react";
import { BreadCrumbs } from "../../components/BreadCrumbs";
import { CodeInput } from "renderer/components/CodeInput";

const exampleSchema = {
  type: "record",
  name: "Schema",
  fields: [],
};

export const CreateSchema = () => {
  const [subjectName, setSubjectName] = useState("");
  const [subjectValue, setSubjectValue] = useState(
    JSON.stringify(exampleSchema, null, 1)
  );

  return (
    <div className="page">
      <BreadCrumbs extraCrumbs={[{ link: "/schemas", text: "Schemas" }]} />
      <h2 className="title nonshrinkContent">Create schema</h2>
      <form className="form shrinkContent">
        <label className="form__label">
          Subject name
          <input
            className="form__input"
            type="text"
            value={subjectName}
            onChange={(e) => {
              setSubjectName(e.target.value);
            }}
          />
        </label>
        <label className="form__label">
          Schema contents
          <CodeInput
            value={subjectValue}
            onChange={(e) => setSubjectValue(e.target.value)}
            language="json"
          />
        </label>
        <button className="form__submit">Create schema</button>
      </form>
    </div>
  );
};
