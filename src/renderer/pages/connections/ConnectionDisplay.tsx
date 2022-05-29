import "./ConnectionDisplay.scss";
import { FunctionComponent } from "react";
import { PersistedConnection } from "renderer/state/connections";

export const ConnectionDisplay: FunctionComponent<{
  connectionName: string;
  connectionValue: PersistedConnection;
}> = ({ connectionName, connectionValue }) => {
  return (
    <div className="connectionDisplay">
      <p>{connectionName}</p>
      <div>
        {" "}
        <label>{connectionValue.connectionType}</label>
      </div>
    </div>
  );
};
