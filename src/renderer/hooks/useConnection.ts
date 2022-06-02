import { useAtomValue } from "jotai";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  BaseConfig,
  ConnectionConfig,
} from "renderer/pages/connections/Connections";
import { Mechanism } from "renderer/pages/connections/CreateSASLKafkaConnection";
import { connectionsAtom } from "renderer/state/connections";
import { TabIdContext, tabsAtom } from "renderer/state/tabs";

export const useConnection = (): ConnectionConfig | undefined => {
  const connections = useAtomValue(connectionsAtom);
  const navigate = useNavigate();

  const tabId = useContext(TabIdContext);
  const tabs = useAtomValue(tabsAtom);
  const selectedConnection = tabs[tabId].connection;

  const connection = connections[selectedConnection];

  if (!connection) {
    navigate("/connections");
    return;
  }

  const {
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
    connectionName: selectedConnection,
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
