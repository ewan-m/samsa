import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useConnection } from "renderer/hooks/useConnection";
import { BreadCrumbs } from "../components/BreadCrumbs";

export const Schemas = () => {
  const [allSchemas, setAllSchemas] = useState<string[]>([]);
  const connection = useConnection();

  useEffect(() => {
    if (connection) {
      (async () => {
        const subjects = await window.api.getSubjects(connection);
        setAllSchemas(subjects);
      })();
    }
  }, []);

  return (
    <div className="page">
      <BreadCrumbs />
      <h2 className="title nonshrinkContent">Schemas</h2>

      <div className="dataTable shrinkContent">
        {allSchemas.map((schema) => (
          <p className="dataTable__item" key={schema}>
            {schema}
          </p>
        ))}
      </div>
      <Link className="button nonshrinkContent" to="/schemas/create">
        Create schema
      </Link>
    </div>
  );
};
