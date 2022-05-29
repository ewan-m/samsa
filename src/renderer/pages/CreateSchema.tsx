import { ChangeEvent, useState } from "react";
import { BreadCrumbs } from "../components/BreadCrumbs";

export const CreateSchema = () => {
  const [subjectName, setSubjectName] = useState("");
  const [subjectValue, setSubjectValue] = useState("");

  const updateSubjectValue = ({ target }: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = target;
    try {
      const parsed = JSON.parse(value);
      setSubjectValue(JSON.stringify(parsed, null, 2));
    } catch (error) {
      setSubjectValue(value);
    }
  };

  return (
    <div className="page">
      <BreadCrumbs extraCrumbs={[{ link: "/schemas", text: "Schemas" }]} />
      <h2 className="title">Create schema</h2>
      <form className="form">
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
          <textarea
            value={subjectValue}
            onChange={(e) => {
              setSubjectValue(e.target.value);
            }}
            className="form__input form__input--code"
          />
        </label>
        <button className="form__submit">Create schema</button>
      </form>
    </div>
  );
};
