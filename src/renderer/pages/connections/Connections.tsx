import "./Connections.scss";
import { Link } from "react-router-dom";
import { BreadCrumbs } from "renderer/components/BreadCrumbs";
import { Mechanism } from "./CreateSASLKafkaConnection";
import { useAtomValue } from "jotai";
import { connectionsAtom } from "renderer/state/connections";
import { DataTable } from "renderer/components/DataTable";

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
      <DataTable
        items={Object.keys(connections)}
        onItemClick={() => {}}
        actions={
          <>
            <Link to="/connections/create-ssl-kafka" className="button">
              Create SSL Kafka
            </Link>
            <Link to="/connections/create-sasl-kafka" className="button">
              Create SASL Kafka
            </Link>

            <Link to="/connections/create-sasl-kafka" className="button">
              Import connections
            </Link>

            <Link to="/connections/create-sasl-kafka" className="button">
              Share connections
            </Link>
          </>
        }
      />
    </div>
  );
};
