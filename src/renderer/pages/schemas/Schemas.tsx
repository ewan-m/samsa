import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataTable } from "renderer/components/DataTable";
import { useConnection } from "renderer/hooks/useConnection";
import { useOpenInNewTab } from "renderer/hooks/useOpenInNewTab";
import { BreadCrumbs } from "../../components/BreadCrumbs";

export const Schemas = () => {
  const [schemas, setSchemas] = useState<string[]>([]);
  const connection = useConnection();

  useEffect(() => {
    if (connection) {
      (async () => {
        const subjects = await window.api.getSubjects(connection);
        setSchemas(subjects);
      })();
    }
  }, []);

  const navigate = useOpenInNewTab();

  return (
    <div className="page">
      <BreadCrumbs />
      <h2 className="title nonshrinkContent">Schemas</h2>

      <DataTable
        items={schemas}
        onItemClick={(item) => {
          navigate(`/schemas/${item}`);
        }}
        actions={
          <>
            <Link className="button" to="/schemas/create">
              Create schema
            </Link>
          </>
        }
      />
    </div>
  );
};
