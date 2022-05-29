import "./Connections.scss";
import { Link } from "react-router-dom";
import { BreadCrumbs } from "renderer/components/BreadCrumbs";
import { Mechanism } from "./CreateSASLKafkaConnection";
import { useAtomValue } from "jotai";
import { connectionsAtom } from "renderer/state/connections";
import { ConnectionDisplay } from "./ConnectionDisplay";

export type BaseConfig = {
  connectionName: string;
  schemaUsername: string;
  schemaPassword: string;
  schemaUri: string;
  clusterUri: string;
};

export type SASLConfig = {
  type: "sasl";
  username: string;
  password: string;
  mechanism: Mechanism;
};

export type SSLConfig = {
  type: "ssl";
  ca: string;
  cert: string;
  key: string;
};

export type ConnectionConfig = BaseConfig & (SSLConfig | SASLConfig);

export const Connections = () => {
  const connections = useAtomValue(connectionsAtom);
  return (
    <div className="page">
      <BreadCrumbs />
      <h2 className="title nonshrinkContent">Connections</h2>
      <div className="shrinkContent">
        {Object.entries(connections).map(
          ([connectionName, connectionValue]) => (
            <ConnectionDisplay {...{ connectionName, connectionValue }} />
          )
        )}
      </div>
      <ul className="connections__creates nonshrinkContent">
        <li>
          <Link to="/connections/create-ssl-kafka" className="button">
            Create SSL Kafka
          </Link>
        </li>
        <li>
          <Link to="/connections/create-sasl-kafka" className="button">
            Create SASL Kafka
          </Link>
        </li>
      </ul>
    </div>
  );
};
