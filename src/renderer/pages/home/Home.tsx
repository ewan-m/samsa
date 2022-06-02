import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { useTabsState } from "renderer/hooks/useTabState";
import { connectionsAtom } from "renderer/state/connections";
import { NavigationCard } from "./NavigationCard";

export const Home = () => {
  const connections = useAtomValue(connectionsAtom);
  const [tabState, setTabState] = useTabsState();
  const connectionNames = Object.keys(connections);

  useEffect(() => {
    if (tabState.connection === "") {
      setTabState({ ...tabState, connection: connectionNames[0] ?? "" });
    }
  }, [connections]);
  return (
    <div className="page">
      <h2 className="title nonshrinkContent">Home</h2>
      <form className="nonshrinkContent">
        <label className="form__label">
          Connection
          <select
            className="form__input"
            value={tabState.connection}
            onChange={(e) => {
              setTabState({ ...tabState, connection: e.target.value });
            }}
          >
            {connectionNames.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>
      </form>
      <div className="shrinkContent">
        <NavigationCard
          to="/topics"
          link="Topics"
          description="View, create and delete topics and their records"
        />
        <NavigationCard
          to="/schemas"
          link="Schemas"
          description="Create, edit, delete and view schemas on the Kafka Schema Registry"
        />
        <NavigationCard
          to="/connections"
          link="Connections"
          description="Manage and share Kafka connection configurations"
        />
        <NavigationCard
          to="/settings"
          link="Settings"
          description="Manage application preferences and caches"
        />
      </div>
    </div>
  );
};
