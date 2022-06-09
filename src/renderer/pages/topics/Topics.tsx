import { useEffect, useState } from "react";
import { DataTable } from "../../components/DataTable";
import { useConnection } from "../../hooks/useConnection";
import { BreadCrumbs } from "../../components/BreadCrumbs";
import { useOpenInNewTab } from "../../hooks/useOpenInNewTab";

export const Topics = () => {
  const [topics, setTopics] = useState<string[]>([]);

  const connection = useConnection();

  useEffect(() => {
    (async () => {
      if (connection) {
        const topics = await window.api.getTopics(connection);
        setTopics(topics);
      }
    })();
  }, []);

  const openInNewTab = useOpenInNewTab();

  return (
    <div className="page">
      <BreadCrumbs />
      <h2 className="title nonshrinkContent">Topics</h2>
      <DataTable
        items={topics}
        onItemClick={(item) => {
          openInNewTab(`/topics/${item}`);
        }}
        actions={<></>}
      />
    </div>
  );
};
