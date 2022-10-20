import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useConnection } from "../../hooks/useConnection";
import { BreadCrumbs } from "../../components/BreadCrumbs";
import ReactJson from "@microlink/react-json-view";
import { JsonViewer } from "renderer/components/JsonViewer";

export const ViewSchema = () => {
  const connection = useConnection();

  const { subjectName } = useParams();
  const [subjectValue, setSubjectValue] = useState("");

  useEffect(() => {
    if (connection && subjectName) {
      (async () => {
        const result = await window.api.getSubjectValue(
          connection,
          subjectName
        );
        setSubjectValue(result);
      })();
    }
  }, [subjectName]);

  return (
    <div className="page">
      <BreadCrumbs
        extraCrumbs={[{ link: "/schemas", text: "Schemas" }]}
        current={subjectName}
      />
      <div className="shrinkContent">
        {subjectValue && <JsonViewer json={JSON.parse(subjectValue)} />}
      </div>
    </div>
  );
};
