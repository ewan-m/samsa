import { Castle, createCastle } from "@ovotech/castle";
import { ConnectionConfig } from "renderer/pages/connections/Connections";

const castleClientCache: {
  [connectionName: string]: Castle;
} = {};

export const getCastle = async (config: ConnectionConfig): Promise<Castle> => {
  if (castleClientCache[config.connectionName]) {
    return castleClientCache[config.connectionName];
  } else {
    const castle = createCastle({
      schemaRegistry: {
        uri: config.schemaUri.replace(
          "https://",
          `https://${config.schemaUsername}:${config.schemaPassword}@`
        ),
      },
      kafka: {
        brokers: [config.clusterUri],
        connectionTimeout: 5000,
        ...(config.type === "ssl"
          ? {
              ssl: {
                rejectUnauthorized: false,
                ca: [config.ca],
                key: config.key,
                cert: config.cert,
              },
            }
          : {
              sasl: {
                username: config.username,
                mechanism: config.mechanism,
                password: config.password,
              },
            }),
      },
    });
    await castle.start();
    castleClientCache[config.connectionName] = castle;
    return castle;
  }
};
