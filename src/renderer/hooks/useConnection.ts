import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import {
  BaseConfig,
  ConnectionConfig,
} from "renderer/pages/connections/Connections";
import { Mechanism } from "renderer/pages/connections/CreateSASLKafkaConnection";
import {
  connectionsAtom,
  selectedConnectionAtom,
} from "renderer/state/connections";

export const useConnection = (): ConnectionConfig | undefined => {
  const connections = useAtomValue(connectionsAtom);
  const selectedConnectionKey = useAtomValue(selectedConnectionAtom);

  const navigate = useNavigate();

  const connection = connections[selectedConnectionKey];

  if (!connection) {
    navigate("/connections");
    return;
  }

  const {
    connectionName,
    schemaUsername,
    schemaPassword,
    schemaUri,
    clusterUri,
    ca,
    key,
    cert,
    username,
    password,
    mechanism,
  } = connection.resolvedParameters;

  const baseConfig: BaseConfig = {
    connectionName,
    schemaUsername,
    schemaPassword,
    schemaUri,
    clusterUri,
  };

  if (connection.connectionType === "ssl") {
    return {
      ...baseConfig,
      type: "ssl",
      ca,
      key,
      cert,
    };
  } else {
    return {
      ...baseConfig,
      type: "sasl",
      username,
      password,
      mechanism: mechanism as Mechanism,
    };
  }
};
